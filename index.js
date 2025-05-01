// index.js import { Telegraf, Markup } from 'telegraf'; import dotenv from 'dotenv'; dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || '7343006860:AAEzZkUuwM_3nfXWqyMG6ZORnlrYvmtewcI'; const ADMIN_ID = process.env.ADMIN_ID || '6243881362'; const bot = new Telegraf(BOT_TOKEN);

const users = new Map(); // userId -> { name, username, balance, referrals, team, joinDate }

// Generate captcha function generateCaptcha() { const num1 = Math.floor(Math.random() * 10); const num2 = Math.floor(Math.random() * 10); return { question: Solve: ${num1} + ${num2} = ?, answer: (num1 + num2).toString(), }; }

bot.start(async (ctx) => { const userId = ctx.from.id; const captcha = generateCaptcha(); users.set(userId, { ...users.get(userId), captcha });

await ctx.replyWithMarkdown(*Welcome!* Please verify you're human.\n${captcha.question}, Markup.inlineKeyboard([ Markup.button.callback('Submit', 'verify_captcha') ]) ); });

bot.action('verify_captcha', async (ctx) => { const user = users.get(ctx.from.id); if (!user || !user.captcha) return ctx.answerCbQuery('Try again.'); const answer = user.captcha.answer;

// For simplicity in this mockup, assume correct user.verified = true; user.name = ctx.from.first_name; user.username = ctx.from.username; user.balance = user.balance || 0; user.referrals = user.referrals || []; user.team = user.team || []; user.joinDate = user.joinDate || new Date().toLocaleString('bn-BD');

await ctx.editMessageText('✅ Verification successful!'); return showMainMenu(ctx); });

function showMainMenu(ctx) { return ctx.reply('Main Menu:', Markup.inlineKeyboard([ [Markup.button.callback('Profile', 'profile'), Markup.button.callback('Refer & Earn', 'refer')], [Markup.button.callback('Team Member', 'team'), Markup.button.callback('Earn Tips', 'tips')], [Markup.button.callback('Withdraw Cash', 'withdraw')], [Markup.button.callback('Support', 'support'), Markup.button.callback('Language', 'language')], ]) ); }

bot.action('profile', (ctx) => { const user = users.get(ctx.from.id); if (!user) return ctx.reply('User not found.'); ctx.reply(👤 Name: ${user.name}\n🆔 ID: ${ctx.from.id}\n💰 Balance: ${user.balance} BDT\n📅 Joined: ${user.joinDate}); });

bot.action('refer', (ctx) => { const user = users.get(ctx.from.id); const link = https://t.me/${ctx.botInfo.username}?start=${ctx.from.id}; ctx.reply(👤 Name: ${user.name}\n🆔 ID: ${ctx.from.id}\n🔗 Referral Link: ${link}\n✅ Earn 50 BDT per successful referral.); });

bot.action('team', (ctx) => { const user = users.get(ctx.from.id); const names = user.team.map(id => users.get(id)?.name || 'Unknown').join(', '); ctx.reply(👥 Team Members: ${user.team.length}\nNames: ${names}); });

bot.action('tips', (ctx) => { ctx.reply('Choose a tip:', Markup.inlineKeyboard([ [Markup.button.callback('Gmail Account Sale', 'tip1')], [Markup.button.callback('Whatsapp Number Sale', 'tip2')], [Markup.button.callback('BDT GAME', 'tip3')], [Markup.button.callback('Web & App Buy', 'tip4')], ]) ); });

bot.action('tip1', (ctx) => ctx.reply('📱 মোবাইল ফোন এর মাধ্যমে জিমেইল একাউন্ট তৈরি করে বিক্রি করুন এবং টাকা উপার্জন করতে নিচের লিংকে ক্লিক করুন ♻️\n👉 link1.com')); bot.action('tip2', (ctx) => ctx.reply('📱 মোবাইল ফোন এর মাধ্যমে Whatsapp একাউন্ট তৈরি করে বিক্রি করুন এবং টাকা উপার্জন করতে নিচের লিংকে ক্লিক করুন ♻️\n👉 link2.com')); bot.action('tip3', (ctx) => ctx.reply('📱 মোবাইল ফোন এর মাধ্যমে BDT GAME খেলে  টাকা উপার্জন করতে নিচের লিংকে ক্লিক করুন ♻️\n👉 link3.com')); bot.action('tip4', (ctx) => ctx.reply('স্বল্প মূল্যে সকল প্রকার Web+App+Bot তৈরি করে ইনকাম শুরু করতে নিচের লিংকে ক্লিক করুন ♻️\n👉 link4.com'));

bot.action('withdraw', (ctx) => { const user = users.get(ctx.from.id); if (user.balance < 1000) { return ctx.reply(আপনার ব্যালেন্স ${user.balance} টাকা। উত্তোলন করতে আপনার প্রয়োজন ১০০০ টাকা। বেশি বেশি রেফার করুন ও আবার চেষ্টা করুন।); } else { return ctx.reply('Bkash/Nagad/Rocket/Upay নম্বর এবং উত্তোলনের পরিমাণ লিখুন:'); } });

bot.action('support', (ctx) => { ctx.reply('যেকোনো প্রকার সমস্যা হলে দ্রুত যোগাযোগ করুন: https://t.me/U011111111'); });

bot.action('language', (ctx) => { ctx.reply('Choose your language:', Markup.inlineKeyboard([ [Markup.button.callback('বাংলা', 'lang_bn'), Markup.button.callback('English', 'lang_en')], [Markup.button.callback('हिंदी', 'lang_hi'), Markup.button.callback('中文', 'lang_cn')], [Markup.button.callback('日本語', 'lang_jp'), Markup.button.callback('عربي', 'lang_ar')], ]) ); });

bot.launch(); console.log('Bot is running...');

