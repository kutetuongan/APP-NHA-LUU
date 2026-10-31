export function formatVND(amount: number): string {
  if (isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('vi-VN').format(val);
}

export function parseNumberFromString(str: string): number {
  const clean = str.replace(/[^\d]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

export interface AmortizationRow {
  period: number;
  dateStr: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}

export interface LoanScheduleResult {
  rows: AmortizationRow[];
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  firstPeriodPayment: number;
  lastPeriodPayment: number;
  totalPeriods: number;
}

export function calculateLoanSchedule(params: {
  loanAmount: number;
  termMonths: number;
  annualRatePercent: number;
  disbursementDate: string; // YYYY-MM-DD
  paymentDayOfMonth: number; // e.g. 25
  cycleDivider: number; // 12 (monthly), 4 (quarterly), 2 (6 months), 1 (annual)
  cycleStepMonths: number;
  roundToThousand: boolean;
}): LoanScheduleResult {
  const {
    loanAmount,
    termMonths,
    annualRatePercent,
    disbursementDate,
    paymentDayOfMonth,
    cycleDivider,
    cycleStepMonths,
    roundToThousand
  } = params;

  const totalPeriods = Math.max(1, Math.floor(termMonths / cycleStepMonths));
  const periodicRate = (annualRatePercent / 100) / cycleDivider;

  // Base raw principal per period
  const rawPrincipalPerPeriod = loanAmount / totalPeriods;
  const standardPrincipal = roundToThousand
    ? Math.round(rawPrincipalPerPeriod / 1000) * 1000
    : Math.round(rawPrincipalPerPeriod);

  const rows: AmortizationRow[] = [];
  let currentBalance = loanAmount;
  let cumulativePrincipal = 0;

  const startDate = disbursementDate ? new Date(disbursementDate) : new Date();

  for (let i = 1; i <= totalPeriods; i++) {
    const isLast = i === totalPeriods;
    const beginningBalance = currentBalance;

    // Last period adjusts for any rounding discrepancy
    let principalForThisPeriod: number;
    if (isLast) {
      principalForThisPeriod = loanAmount - cumulativePrincipal;
    } else {
      principalForThisPeriod = standardPrincipal;
    }

    // Raw interest
    let interest = beginningBalance * periodicRate;
    if (roundToThousand) {
      interest = Math.round(interest / 1000) * 1000;
    } else {
      interest = Math.round(interest);
    }

    const endingBalance = Math.max(0, beginningBalance - principalForThisPeriod);
    const totalPayment = principalForThisPeriod + interest;

    // Calculate payment date
    // Starting from disbursement month + stepMonths * i
    const targetDate = new Date(startDate);
    targetDate.setMonth(targetDate.getMonth() + i * cycleStepMonths);
    // Adjust day of month
    const maxDaysInTargetMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
    const actualDay = Math.min(paymentDayOfMonth, maxDaysInTargetMonth);
    targetDate.setDate(actualDay);

    const formattedDate = `${String(targetDate.getDate()).padStart(2, '0')}/${String(targetDate.getMonth() + 1).padStart(2, '0')}/${targetDate.getFullYear()}`;

    rows.push({
      period: i,
      dateStr: formattedDate,
      beginningBalance,
      principal: principalForThisPeriod,
      interest,
      totalPayment,
      endingBalance
    });

    cumulativePrincipal += principalForThisPeriod;
    currentBalance = endingBalance;
  }

  const totalPrincipal = rows.reduce((acc, r) => acc + r.principal, 0);
  const totalInterest = rows.reduce((acc, r) => acc + r.interest, 0);
  const totalPayment = totalPrincipal + totalInterest;

  return {
    rows,
    totalPrincipal,
    totalInterest,
    totalPayment,
    firstPeriodPayment: rows[0]?.totalPayment || 0,
    lastPeriodPayment: rows[rows.length - 1]?.totalPayment || 0,
    totalPeriods
  };
}

export function calculateDepositInterest(amount: number, months: number, ratePercent: number) {
  if (amount <= 0 || months <= 0 || ratePercent < 0) {
    return { interest: 0, total: 0 };
  }
  // Formula: Interest = (Amount * rate/100 * months) / 12
  const interest = Math.round((amount * (ratePercent / 100) * months) / 12);
  const total = amount + interest;
  return { interest, total };
}
