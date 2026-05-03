const Inquiry = require("../../models/Inquiry");
const AnalyticsDaily = require("../../models/AnalyticsDaily");

function utcDayKey(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthKeysBetween(start, end) {
  const keys = [];
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  const endUtc = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1);

  while (cursor.getTime() <= endUtc) {
    const y = cursor.getUTCFullYear();
    const m = String(cursor.getUTCMonth() + 1).padStart(2, "0");
    keys.push(`${y}-${m}`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return keys;
}

function monthLabel(ymKey) {
  const [y, m] = ymKey.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
}

function pctDelta(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function ymKeyUtc(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

exports.getDashboardSummary = async (_req, res) => {
  try {
    const now = new Date();
    const thisYm = ymKeyUtc(now);

    const lastMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const lastYm = ymKeyUtc(lastMonthDate);

    const windowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
    const startYm = ymKeyUtc(windowStart);

    const todayKey = utcDayKey(now);

    const [visitTotals, visitMonthly, inquiryTotals, inquiryMonthlyRaw] = await Promise.all([
      AnalyticsDaily.aggregate([{ $group: { _id: null, total: { $sum: "$pageViews" } } }]),
      AnalyticsDaily.aggregate([
        {
          $match: {
            dayKey: {
              $gte: `${startYm}-01`,
              $lte: todayKey,
            },
          },
        },
        {
          $project: {
            ym: { $substr: ["$dayKey", 0, 7] },
            pageViews: 1,
          },
        },
        {
          $group: {
            _id: "$ym",
            visits: { $sum: "$pageViews" },
          },
        },
      ]),
      Inquiry.aggregate([
        {
          $facet: {
            total: [{ $count: "c" }],
            thisMonth: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(`${thisYm}-01T00:00:00.000Z`),
                    $lt: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)),
                  },
                },
              },
              { $count: "c" },
            ],
            lastMonth: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(`${lastYm}-01T00:00:00.000Z`),
                    $lt: new Date(`${thisYm}-01T00:00:00.000Z`),
                  },
                },
              },
              { $count: "c" },
            ],
          },
        },
      ]),
      Inquiry.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${startYm}-01T00:00:00.000Z`),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "UTC" },
            },
            enquiries: { $sum: 1 },
          },
        },
      ]),
    ]);

    const totalVisits =
      visitTotals[0]?.total && typeof visitTotals[0].total === "number"
        ? visitTotals[0].total
        : 0;

    const visitMap = {};
    for (const row of visitMonthly) {
      if (row._id) visitMap[row._id] = row.visits ?? 0;
    }

    const inquiryFacet = inquiryTotals[0] ?? {};
    const totalEnquiries = inquiryFacet.total?.[0]?.c ?? 0;
    const enquiriesThisMonth = inquiryFacet.thisMonth?.[0]?.c ?? 0;
    const enquiriesLastMonth = inquiryFacet.lastMonth?.[0]?.c ?? 0;

    const inquiryMap = {};
    for (const row of inquiryMonthlyRaw) {
      if (row._id) inquiryMap[row._id] = row.enquiries ?? 0;
    }

    const rangeMonths = monthKeysBetween(windowStart, now);

    const visitsThisMonth = visitMap[thisYm] ?? 0;
    const visitsLastMonth = visitMap[lastYm] ?? 0;

    const monthlyTrend = rangeMonths.map((ym) => ({
      monthKey: ym,
      label: monthLabel(ym),
      visits: visitMap[ym] ?? 0,
      enquiries: inquiryMap[ym] ?? 0,
    }));

    const recentRaw = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentInquiries = recentRaw.map((o) => ({
      id: String(o._id),
      name: o.name ?? "",
      email: o.email ?? "",
      phone: o.phone ?? "",
      message: o.message ?? "",
      source: o.source ?? "contact_page",
      createdAt: o.createdAt,
    }));

    return res.status(200).json({
      message: "Dashboard summary fetched.",
      summary: {
        totalVisits,
        visitsThisMonth,
        visitsLastMonthDeltaPercent: pctDelta(visitsThisMonth, visitsLastMonth),
        totalEnquiries,
        enquiriesThisMonth,
        enquiriesLastMonthDeltaPercent: pctDelta(enquiriesThisMonth, enquiriesLastMonth),
        monthlyTrend,
        recentInquiries,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
