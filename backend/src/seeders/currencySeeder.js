import Currency from "../models/currency/currency.js";

const currencies = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', sortOrder: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', sortOrder: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', sortOrder: 3 },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', sortOrder: 4 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', sortOrder: 5 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA', sortOrder: 6 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG', sortOrder: 7 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'ar-AE', sortOrder: 8 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP', sortOrder: 9 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN', sortOrder: 10 }
];

export const seedCurrencies = async () => {
  try {
    console.log('🌱 Seeding currencies...');

    // Check if currencies already exist
    const existingCount = await Currency.countDocuments();
    if (existingCount > 0) {
      console.log('✅ Currencies already exist, skipping seed');
      return;
    }

    // Insert currencies
    await Currency.insertMany(currencies);
    console.log(`✅ Successfully seeded ${currencies.length} currencies`);

  } catch (error) {
    console.error('❌ Currency seeding failed:', error);
    throw error;
  }
};

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('../config/database.js').then(() => {
    seedCurrencies().then(() => {
      console.log('Currency seeding completed');
      process.exit(0);
    }).catch((error) => {
      console.error('Currency seeding failed:', error);
      process.exit(1);
    });
  });
}