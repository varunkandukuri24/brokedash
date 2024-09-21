import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const categories = [
  { name: "Splurge Specialist", range: "90-99th", emoji: "💸" },
  { name: "Impulse Investor", range: "80-89th", emoji: "🛍️" },
  { name: "Carefree Cashburner", range: "70-79th", emoji: "🔥" },
  { name: "Whimsical Wallet-Drainer", range: "60-69th", emoji: "🎭" },
  { name: "Middling Money Manager", range: "50-59th", emoji: "➗" },
  { name: "Prudent Penny-Pincher", range: "40-49th", emoji: "🐷" },
  { name: "Savvy Saver", range: "30-39th", emoji: "🧠" },
  { name: "Frugal Financier", range: "20-29th", emoji: "📊" },
  { name: "Thrift Theorist", range: "10-19th", emoji: "🧮" },
  { name: "Miserly Maestro", range: "0-9th", emoji: "🧙" }
];

const calculateScore = (monthlySpend: number, incomeLevel: string): number => {
  const income = getIncomeValue(incomeLevel);
  const spendRatio = monthlySpend / (income / 12);
  const incomeMultiplier = 1 + (1 - income / 300000);
  return spendRatio * incomeMultiplier;
};

const calculateDaysTillBroke = (incomeLevel: string, monthlySpend: number): number => {
  const annualIncome = getIncomeValue(incomeLevel);
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

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    // Fetch all users
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, income_level, monthly_spend');

    if (allUsersError) throw allUsersError;

    // Calculate scores and rank users
    const scoredUsers = allUsers.map(user => ({
      ...user,
      score: calculateScore(user.monthly_spend, user.income_level)
    }));

    const rankedUsers = scoredUsers.sort((a, b) => b.score - a.score)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    const totalUsers = rankedUsers.length;

    // Categorize users
    const categorizedUsers = rankedUsers.map(user => {
      const percentile = (user.rank / totalUsers) * 100;
      const categoryIndex = Math.min(Math.floor(percentile / 10), categories.length - 1);
      return {
        ...user,
        category: categories[categoryIndex].name,
        emoji: categories[categoryIndex].emoji,
        days_till_broke: calculateDaysTillBroke(user.income_level, user.monthly_spend)
      };
    });

    // Update brokerank table
    const { error: upsertError } = await supabase
      .from('brokerank')
      .upsert(
        categorizedUsers.map(user => ({
          id: user.id,
          rank: user.rank,
          days_till_broke: user.days_till_broke,
          category: user.category,
          emoji: user.emoji,
          income_level: user.income_level,
          monthly_spend: user.monthly_spend,
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'id' }
      );

    if (upsertError) throw upsertError;

    return NextResponse.json({ message: 'Brokerank updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating brokerank:', error);
    return NextResponse.json({ message: 'Error updating brokerank', error: JSON.stringify(error) }, { status: 500 });
  }
}