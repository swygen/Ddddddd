// index.js const { Telegraf, Markup } = require('telegraf'); const moment = require('moment-timezone'); const bot = new Telegraf(process.env.BOT_TOKEN);

const ADMIN_ID = '6243881362'; const users = new Map();

function generateCaptcha() { const a = Math.floor(Math.random() * 10); const b = Math.floor(Math.random() * 10); return { question: ${a} + ${b} = ?, answer: (a + b).toString(), }; }

bot.start(async (ctx) => { const captcha = generateCaptcha(); ctx.session = { captcha }; await ctx.replyWithHTML(<b>Captcha Verification</b>\nSolve: ${captcha.question}, Markup.inlineKeyboard([ [Markup.button.callback('Submit Answer', 'captcha_verify')] ]) ); });

bot.action('captcha_verify', async (ctx) => { ctx.answerCbQuery(); const answer = ctx.session?.captcha?.answer; await ctx.reply(Please type the answer to: ${ctx.session.captcha.question}); bot.on('text', async (ctx) => { if (ctx.message.text === answer) { registerUser(ctx); await showMainMenu(ctx); } else { const newCaptcha = generateCaptcha(); ctx.session.captcha = newCaptcha; await ctx.reply(❌ Wrong! Try again:\n${newCaptcha.question}); } }); });

function registerUser(ctx) { if (!users.has(ctx.from.id)) { users.set(ctx.from.id, { id: ctx.from.id, name: ${ctx.from.first_name}, balance: 0, joinDate: moment().tz('Asia/Dhaka').format('YYYY-MM-DD HH:mm:ss'), referrals: [], }); } }

function showMainMenu(ctx) { return ctx.reply(Welcome, ${ctx.from.first_name}!, Markup.inlineKeyboard([ [Markup.button.callback('Profile', 'profile'), Markup.button.callback('Refer & Earn', 'refer')], [Markup.button.callback('Team Member', 'team')], [Markup.button.callback('Earn Tips', 'earn_tips')], [Markup.button.callback('Withdraw Cash', 'withdraw')], [Markup.button.callback('Support', 'support'), Markup.button.callback('Language', 'language')] ])); }

bot.action('profile', (ctx) => { const user = users.get(ctx.from.id); ctx.reply(👤 Name: ${user.name}\n🆔 ID: ${user.id}\n💰 Balance: ${user.balance} BDT\n📅 Joined: ${user.joinDate}); });

bot.action('refer', (ctx) => { const user = users.get(ctx.from.id); const link = https://t.me/${bot.botInfo.username}?start=${ctx.from.id}; ctx.reply(👤 Name: ${user.name}\n🆔 ID: ${user.id}\n🔗 Referral Link: ${link}\n\n✅ Earn 50 BDT per referral. Share the link above!); });

bot.action('team', (ctx) => { const user = users.get(ctx.from.id); const teamList = user.referrals.map(id => users.get(id)?.name).join(', ') || 'No team members yet.'; ctx.reply(👥 Team Members: ${user.referrals.length}\n👤 Users: ${teamList}); });

bot.action('earn_tips', (ctx) => { ctx.reply('Choose a tip:', Markup.inlineKeyboard([ [Markup.button.callback('1. Gmail account sale', 'tip1')], [Markup.button.callback('2. Whatsapp number sale', 'tip2')], [Markup.button.callback('3. BDT GAME', 'tip3')], [Markup.button.callback('4. All Types Web&App Buy', 'tip4')] ])); });

bot.action('tip1', (ctx) => { ctx.reply('📱 মোবাইল ফোন এর মাধ্যমে জিমেইল একাউন্ট তৈরি করে বিক্রি করুন এবং টাকা উপার্জন করতে নিচের লিংকে ক্লিক করুন ♻️\nlink1.com'); });

bot.action('tip2', (ctx) => { ctx.reply('📱 মোবাইল ফোন এর মাধ্যমে Whatsapp একাউন্ট তৈরি করে বিক্রি করুন এবং টাকা উপার্জন করতে নিচের লিংকে ক্লিক করুন ♻️\nlink2.com'); });

bot.action('tip3', (ctx) => { ctx.reply('📱 মোবাইল ফোন এর মাধ্যমে BDT GAME খেলে টাকা উপার্জন করতে নিচের লিংকে ক্লিক করুন ♻️\nlink3.com'); });

bot.action('tip4', (ctx) => { ctx.reply('স্বল্প মূল্যে সকল প্রকার Web+App+Bot তৈরি করে ইনকাম শুরু করতে নিচের লিংকে ক্লিক করুন ♻️\nlink4.com'); });

bot.action('withdraw', (ctx) => { const user = users.get(ctx.from.id); if (user.balance < 1000) { ctx.reply(আপনার ব্যালেন্স (${user.balance} BDT) উত্তোলন করতে আপনার প্রয়োজন ১০০০ টাকা। বেশি বেশি রেফার করুন এবং আবারো চেষ্টা করুন ধন্যবাদ।); } else { ctx.reply('উত্তোলন করতে নিচে আপনার নাম্বার এবং পরিমাণ লিখুন (উদাহরণ: Bkash 017XXXXXXXX 1000)'); bot.on('text', (ctx) => { ctx.reply('✅ অনুরোধ গ্রহণ করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।'); }); } });

bot.action('support', (ctx) => { ctx.reply('যেকোনো প্রকার সমস্যা হলে দ্রুত যোগাযোগ করুন এবং আপনার সমস্যার সমাধান করুন: https://t.me/U011111111'); });

bot.action('language', (ctx) => { ctx.reply('Choose language:', Markup.inlineKeyboard([ [Markup.button.callback('বাংলা', 'lang_bn'), Markup.button.callback('English', 'lang_en')], [Markup.button.callback('हिंदी', 'lang_hi'), Markup.button.callback('中文', 'lang_cn')], [Markup.button.callback('日本語', 'lang_jp'), Markup.button.callback('عربى', 'lang_ar')] ])); });

// Admin Commands bot.command('admin', (ctx) => { if (ctx.from.id.toString() === ADMIN_ID) { let msg = 'All Users:\n'; for (let [id, data] of users) { msg += ID: ${id}, Name: ${data.name}, Balance: ${data.balance}\n; } ctx.reply(msg); } });

bot.launch();

  
