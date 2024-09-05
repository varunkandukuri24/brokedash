import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const categories = [
  { name: "Broke Beginner", range: "0-9th", emoji: "😓" },
  { name: "Frugal Freshman", range: "10-19th", emoji: "🐣" },
  { name: "Savvy Sophomore", range: "20-29th", emoji: "📚" },
  { name: "Judicious Junior", range: "30-39th", emoji: "🤔" },
  { name: "Senior Saver", range: "40-49th", emoji: "💼" },
  { name: "Balanced Bachelor", range: "50-59th", emoji: "⚖️" },
  { name: "Master of Moderation", range: "60-69th", emoji: "🧘" },
  { name: "Doctorate in Dollars", range: "70-79th", emoji: "🎓" },
  { name: "Professor of Prosperity", range: "80-89th", emoji: "🏆" },
  { name: "Wealth Wizard", range: "90-99th", emoji: "🧙" }
];

const calculateDaysTillBroke = (incomeLevel: string, monthlySpend: number) => {
  const annualIncome = getIncomeValue(incomeLevel);

  const monthlySavings = (annualIncome / 12) - monthlySpend;
  return Math.max(0, Math.floor((annualIncome / 365) / (monthlySpend / 30)));
};

const getIncomeValue = (incomeLevel: string): number => {
  switch (incomeLevel) {
    case '<100k': return 75000;
    case '100k-150k': return 125000;
    case '150k-250k': return 200000;
    case '250k+': return 300000;
    default: return 75000;
  }
};

const calculateScore = (monthlySpend: number, incomeLevel: string): number => {
  const income = getIncomeValue(incomeLevel);
  const spendRatio = monthlySpend / (income / 12);
  const incomeMultiplier = 1 + (1 - income / 300000);
  return spendRatio * incomeMultiplier;
};

export async function POST() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, income_level, monthly_spend');

    if (error) throw error;

    const scoredData = users.map(user => ({
      ...user,
      score: calculateScore(user.monthly_spend, user.income_level)
    }));

    const sortedData = scoredData.sort((a, b) => b.score - a.score);

    const brokedashers = sortedData.map((userData, index) => {
      const rank = index + 1;
      const categoryIndex = Math.min(Math.floor((rank - 1) / 10), categories.length - 1);
      const category = categories[categoryIndex];

      return {
        id: userData.id,
        rank,
        days_till_broke: calculateDaysTillBroke(userData.income_level, userData.monthly_spend),
        category: category.name,
        emoji: category.emoji,
        income_level: userData.income_level,
        monthly_spend: userData.monthly_spend,
        updated_at: new Date().toISOString()
      };
    });

    const { error: upsertError } = await supabase
      .from('brokerank')
      .upsert(brokedashers);

    if (upsertError) throw upsertError;

    return NextResponse.json({ message: 'Brokerank updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating brokerank:', error);
    return NextResponse.json({ message: 'Error updating brokerank' }, { status: 500 });
  }
}