import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { invoiceAPI } from '../../services/invoiceService';
import { currencyService } from '../../services/currencyService';

const DashboardStats = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await invoiceAPI.getAll();
        const invoices = res.data || [];

        const now = new Date();
        let totalRevenue = 0;
        let unpaidAmount = 0;
        let overdueCount = 0;
        let paidCount = 0;

        invoices.forEach((inv) => {
          const grand = inv.totals?.grandTotal || 0;
          totalRevenue += grand;
          if (inv.paymentStatus === 'paid') {
            paidCount++;
          } else {
            unpaidAmount += grand;
            if (inv.invoiceMeta?.dueDate && new Date(inv.invoiceMeta.dueDate) < now) {
              overdueCount++;
            }
          }
        });

        setStats({
          total: invoices.length,
          totalRevenue,
          unpaidAmount,
          overdueCount,
          paidCount,
        });
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [refreshKey]);

  const fmt = (amount) => {
    const symbol = currencyService.getSymbol('INR');
    return `${symbol}${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
  };

  const cards = stats
    ? [
        {
          label: 'Total Invoices',
          value: stats.total,
          sub: `${stats.paidCount} paid`,
          icon: FileText,
          color: 'from-indigo-500 to-indigo-600',
          bg: 'bg-indigo-50',
          text: 'text-indigo-600',
        },
        {
          label: 'Total Revenue',
          value: fmt(stats.totalRevenue),
          sub: 'all time',
          icon: TrendingUp,
          color: 'from-emerald-500 to-emerald-600',
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
        },
        {
          label: 'Unpaid Amount',
          value: fmt(stats.unpaidAmount),
          sub: `${stats.total - stats.paidCount} invoices`,
          icon: Clock,
          color: 'from-amber-500 to-amber-600',
          bg: 'bg-amber-50',
          text: 'text-amber-600',
        },
        {
          label: 'Overdue',
          value: stats.overdueCount,
          sub: stats.overdueCount === 0 ? 'all clear' : 'need attention',
          icon: AlertTriangle,
          color: stats.overdueCount > 0 ? 'from-red-500 to-red-600' : 'from-slate-400 to-slate-500',
          bg: stats.overdueCount > 0 ? 'bg-red-50' : 'bg-slate-50',
          text: stats.overdueCount > 0 ? 'text-red-600' : 'text-slate-500',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
            <div className="h-7 bg-slate-200 rounded w-16 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.text} mb-1`}>{card.value}</p>
            <p className="text-xs text-slate-400">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
