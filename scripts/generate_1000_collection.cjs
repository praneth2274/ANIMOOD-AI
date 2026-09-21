const fs = require('fs');
const path = require('path');

// Image pools with high quality anime/manga aesthetic imagery
const MANGA_IMAGES = [
  'https://cdn.myanimelist.net/images/manga/1/157897.jpg',
  'https://cdn.myanimelist.net/images/manga/1/259070.jpg',
  'https://cdn.myanimelist.net/images/manga/3/54525.jpg',
  'https://cdn.myanimelist.net/images/manga/2/253457.jpg',
  'https://cdn.myanimelist.net/images/manga/2/171872.jpg',
  'https://cdn.myanimelist.net/images/manga/3/116963.jpg',
  'https://cdn.myanimelist.net/images/manga/3/164420.jpg',
  'https://cdn.myanimelist.net/images/manga/2/258749.jpg',
  'https://cdn.myanimelist.net/images/manga/2/188040.jpg',
  'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
  'https://cdn.myanimelist.net/images/manga/3/210341.jpg',
  'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
  'https://cdn.myanimelist.net/images/manga/3/117681.jpg',
  'https://cdn.myanimelist.net/images/manga/3/180031.jpg',
  'https://cdn.myanimelist.net/images/manga/2/248749.jpg',
  'https://cdn.myanimelist.net/images/manga/1/214300.jpg',
  'https://cdn.myanimelist.net/images/manga/3/263548.jpg',
  'https://cdn.myanimelist.net/images/manga/3/161474.jpg'
];

const MANHWA_IMAGES = [
  'https://cdn.myanimelist.net/images/manga/3/222295.jpg',
  'https://cdn.myanimelist.net/images/manga/2/236147.jpg',
  'https://cdn.myanimelist.net/images/manga/1/260062.jpg',
  'https://cdn.myanimelist.net/images/manga/3/232049.jpg',
  'https://cdn.myanimelist.net/images/manga/1/223788.jpg',
  'https://cdn.myanimelist.net/images/manga/1/237669.jpg',
  'https://cdn.myanimelist.net/images/manga/1/170366.jpg',
  'https://cdn.myanimelist.net/images/manga/1/256728.jpg',
  'https://cdn.myanimelist.net/images/manga/3/250956.jpg',
  'https://cdn.myanimelist.net/images/manga/2/266782.jpg',
  'https://cdn.myanimelist.net/images/manga/3/247854.jpg',
  'https://cdn.myanimelist.net/images/manga/3/239794.jpg',
  'https://cdn.myanimelist.net/images/manga/1/172233.jpg',
  'https://cdn.myanimelist.net/images/manga/3/218844.jpg',
  'https://cdn.myanimelist.net/images/manga/2/236053.jpg',
  'https://cdn.myanimelist.net/images/manga/2/236894.jpg',
  'https://cdn.myanimelist.net/images/manga/3/243765.jpg',
  'https://cdn.myanimelist.net/images/manga/3/234752.jpg',
  'https://cdn.myanimelist.net/images/manga/1/214470.jpg',
  'https://cdn.myanimelist.net/images/manga/2/236052.jpg',
  'https://cdn.myanimelist.net/images/manga/3/236050.jpg',
  'https://cdn.myanimelist.net/images/manga/1/236051.jpg',
  'https://cdn.myanimelist.net/images/manga/2/252273.jpg'
];

const MANHUA_IMAGES = [
  'https://cdn.myanimelist.net/images/manga/3/177926.jpg',
  'https://cdn.myanimelist.net/images/manga/2/235794.jpg',
  'https://cdn.myanimelist.net/images/manga/3/217997.jpg',
  'https://cdn.myanimelist.net/images/manga/3/240212.jpg',
  'https://cdn.myanimelist.net/images/manga/1/157922.jpg',
  'https://cdn.myanimelist.net/images/manga/2/177925.jpg',
  'https://cdn.myanimelist.net/images/manga/3/177927.jpg',
  'https://cdn.myanimelist.net/images/manga/2/266783.jpg',
  'https://cdn.myanimelist.net/images/manga/1/250958.jpg',
  'https://cdn.myanimelist.net/images/manga/1/217998.jpg',
  'https://cdn.myanimelist.net/images/manga/1/141071.jpg',
  'https://cdn.myanimelist.net/images/manga/1/218000.jpg',
  'https://cdn.myanimelist.net/images/manga/3/194451.jpg',
  'https://cdn.myanimelist.net/images/manga/2/189914.jpg'
];

const DONGHUA_IMAGES = [
  'https://cdn.myanimelist.net/images/anime/1123/108520.jpg',
  'https://cdn.myanimelist.net/images/anime/1416/114997.jpg',
  'https://cdn.myanimelist.net/images/anime/1148/109033.jpg',
  'https://cdn.myanimelist.net/images/anime/1267/97801.jpg',
  'https://cdn.myanimelist.net/images/anime/1987/92484.jpg',
  'https://cdn.myanimelist.net/images/anime/1344/94833.jpg',
  'https://cdn.myanimelist.net/images/anime/1769/94848.jpg',
  'https://cdn.myanimelist.net/images/anime/1582/108849.jpg',
  'https://cdn.myanimelist.net/images/anime/1660/103986.jpg',
  'https://cdn.myanimelist.net/images/anime/1063/113824.jpg',
  'https://cdn.myanimelist.net/images/anime/1844/110534.jpg',
  'https://cdn.myanimelist.net/images/anime/1547/108518.jpg',
  'https://cdn.myanimelist.net/images/anime/1061/137685.jpg',
  'https://cdn.myanimelist.net/images/anime/1379/134812.jpg',
  'https://cdn.myanimelist.net/images/anime/1765/104523.jpg'
];

const BANNERS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80'
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ======================== MANGA TITLES (260 distinct titles) ========================
const MANGA_RAW = [
  { t: "Naruto", n: "NARUTO -ナルト-", r: "Naruto", g: ["Action", "Adventure", "Fantasy"], c: 700, cr: "Masashi Kishimoto", y: 1999, rate: 8.25, d: "A young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village." },
  { t: "Bleach", n: "BLEACH", r: "Burīchi", g: ["Action", "Supernatural", "Adventure"], c: 686, cr: "Tite Kubo", y: 2001, rate: 8.18, d: "High school student Ichigo Kurosaki gains the powers of a Soul Reaper and takes on the duties of defending humans from evil spirits." },
  { t: "Dragon Ball", n: "ドラゴンボール", r: "Doragon Bōru", g: ["Action", "Martial Arts", "Adventure"], c: 519, cr: "Akira Toriyama", y: 1984, rate: 8.52, d: "Follows the adventures of Son Goku from childhood to adulthood as he trains in martial arts and explores the world in search of dragon balls." },
  { t: "Hunter x Hunter", n: "HUNTER×HUNTER", r: "Hantā Hantā", g: ["Action", "Adventure", "Fantasy"], c: 400, cr: "Yoshihiro Togashi", y: 1998, rate: 8.78, d: "Gon Freecss discovers that his father is a world-renowned Hunter and embarks on a dangerous journey to take the Hunter Examination." },
  { t: "Death Note", n: "DEATH NOTE", r: "Desu Nōto", g: ["Psychological", "Supernatural", "Thriller"], c: 108, cr: "Tsugumi Ohba & Takeshi Obata", y: 2003, rate: 8.71, d: "A high school prodigy discovers a mysterious notebook capable of killing anyone whose name is written in it." },
  { t: "Fullmetal Alchemist", n: "鋼の錬金術師", r: "Hagane no Renkinjutsushi", g: ["Action", "Adventure", "Drama"], c: 108, cr: "Hiromu Arakawa", y: 2001, rate: 9.04, d: "Two alchemist brothers seek the Philosopher's Stone after a disastrous attempt to bring their mother back to life." },
  { t: "Tokyo Ghoul", n: "東京喰種", r: "Tōkyō Gūru", g: ["Action", "Horror", "Psychological"], c: 143, cr: "Sui Ishida", y: 2011, rate: 8.54, d: "A college student transformed into a half-ghoul after a deadly encounter must navigate surviving in a violent hidden society." },
  { t: "Vagabond", n: "バガボンド", r: "Bagabondo", g: ["Action", "Historical", "Martial Arts"], c: 327, cr: "Takehiko Inoue", y: 1998, rate: 9.25, d: "A philosophical portrait of the legendary sword saint Miyamoto Musashi on his spiritual quest for invincible swordsmanship." },
  { t: "Vinland Saga", n: "ヴィンランド・サガ", r: "Vinrando Saga", g: ["Action", "Historical", "Adventure"], c: 210, cr: "Makoto Yukimura", y: 2005, rate: 9.02, d: "Thorfinn pursues vengeance against the mercenary leader who killed his father, only to discover the true cost of violence." },
  { t: "Monster", n: "MONSTER", r: "Monsutā", g: ["Psychological", "Mystery", "Thriller"], c: 162, cr: "Naoki Urasawa", y: 1994, rate: 9.15, d: "Brain surgeon Kenzo Tenma risks everything to track down a sociopathic killer whose life he saved years earlier." },
  { t: "Kingdom", n: "キングダム", r: "Kingudamu", g: ["Action", "Historical", "Military"], c: 790, cr: "Yasuhisa Hara", y: 2006, rate: 8.98, d: "In Warring States China, a war orphan dreams of becoming the greatest general under the heavens while aiding the King of Qin." },
  { t: "20th Century Boys", n: "20世紀少年", r: "Nijusseiki Shōnen", g: ["Mystery", "Sci-Fi", "Psychological"], c: 249, cr: "Naoki Urasawa", y: 1999, rate: 8.94, d: "A convenience store manager discovers that a mysterious cult leader known as 'Friend' is executing the apocalyptic plans he drew as a kid." },
  { t: "Slam Dunk", n: "SLAM DUNK", r: "Suramu Danku", g: ["Sports", "Comedy", "Drama"], c: 276, cr: "Takehiko Inoue", y: 1990, rate: 9.08, d: "Delinquent Hanamichi Sakuragi joins the Shohoku High basketball team to impress a girl, only to discover a passion for the sport." },
  { t: "Haikyu!!", n: "ハイキュー!!", r: "Haikyū!!", g: ["Sports", "Comedy", "Drama"], c: 402, cr: "Haruichi Furudate", y: 2012, rate: 8.87, d: "Short-statured Shoyo Hinata aims to conquer national volleyball alongside his rival-turned-teammate Tobio Kageyama." },
  { t: "Blue Lock", n: "ブルーロック", r: "Burū Rokku", g: ["Sports", "Action", "Psychological"], c: 270, cr: "Muneyuki Kaneshiro & Yusuke Nomura", y: 2018, rate: 8.42, d: "Three hundred elite high school strikers are locked in an intense prison-like training facility to forge Japan's ultimate egoist striker." },
  { t: "Jujutsu Kaisen", n: "呪術廻戦", r: "Jujutsu Kaisen", g: ["Action", "Supernatural", "Dark Fantasy"], c: 271, cr: "Gege Akutami", y: 2018, rate: 8.52, d: "Yuji Itadori swallows a cursed finger of the King of Curses, entering Tokyo Prefectural Jujutsu High School to exorcise curses." },
  { t: "Chainsaw Man", n: "チェンソーマン", r: "Chensō Man", g: ["Action", "Dark Fantasy", "Supernatural"], c: 175, cr: "Tatsuki Fujimoto", y: 2018, rate: 8.65, d: "Denji merges with his devil dog Pochita to become Chainsaw Man, joining Public Safety Devil Hunters for food and dreams." },
  { t: "Demon Slayer: Kimetsu no Yaiba", n: "鬼滅の刃", r: "Kimetsu no Yaiba", g: ["Action", "Historical", "Supernatural"], c: 205, cr: "Koyoharu Gotouge", y: 2016, rate: 8.35, d: "Tanjiro Kamado joins the Demon Slayer Corps to avenge his slaughtered family and find a cure for his demon sister Nezuko." },
  { t: "Spy x Family", n: "SPY×FAMILY", r: "Supai Famirī", g: ["Comedy", "Action", "Slice of Life"], c: 102, cr: "Tatsuya Endo", y: 2019, rate: 8.58, d: "A master spy unknowingly adopts a telepathic daughter and marries an assassin while keeping their secret identities hidden." },
  { t: "My Hero Academia", n: "僕のヒーローアカデミア", r: "Boku no Hīrō Akademia", g: ["Action", "Super Power", "School"], c: 430, cr: "Kohei Horikoshi", y: 2014, rate: 8.19, d: "In a world of superpowers, quirkless Izuku Midoriya inherits the power of the greatest hero All Might at U.A. High." },
  { t: "JoJo's Bizarre Adventure", n: "ジョジョの奇妙な冒険", r: "JoJo no Kimyō na Bōken", g: ["Action", "Supernatural", "Adventure"], c: 950, cr: "Hirohiko Araki", y: 1987, rate: 8.75, d: "Follows generations of the Joestar family combating supernatural threats utilizing Hamon martial arts and Stands." },
  { t: "Oyasumi Punpun", n: "おやすみプンプン", r: "Oyasumi Punpun", g: ["Psychological", "Drama", "Slice of Life"], c: 147, cr: "Inio Asano", y: 2007, rate: 9.01, d: "A coming-of-age portrait of Punpun Onodera navigating childhood innocence, depression, family dysfunction, and romantic obsession." },
  { t: "Gantz", n: "GANTZ", r: "Gantsu", g: ["Action", "Sci-Fi", "Horror"], c: 383, cr: "Hiroya Oku", y: 2000, rate: 8.12, d: "Resurrected people are summoned by a black sphere called Gantz and forced to participate in lethal alien-hunting games." },
  { t: "Claymore", n: "CLAYMORE", r: "Kureimoa", g: ["Action", "Dark Fantasy", "Supernatural"], c: 155, cr: "Norihiro Yagi", y: 2001, rate: 8.32, d: "Clare, a silver-eyed half-human half-Yoma warrior known as a Claymore, slaughters monstrous shape-shifters across a bleak realm." },
  { t: "D.Gray-man", n: "D.Gray-man", r: "Dī Gureiman", g: ["Action", "Dark Fantasy", "Supernatural"], c: 250, cr: "Katsura Hoshino", y: 2004, rate: 8.15, d: "Allen Walker wields an anti-akuma weapon to battle the Millennium Earl and his demonic creations for the Black Order." },
  { t: "Soul Eater", n: "ソウルイーター", r: "Sōru Ītā", g: ["Action", "Supernatural", "Fantasy"], c: 113, cr: "Atsushi Ohkubo", y: 2004, rate: 8.14, d: "Students at Death Weapon Meister Academy collect 99 evil souls and one witch soul to turn weapon partners into Death Scythes." },
  { t: "Fire Force", n: "炎炎ノ消防隊", r: "En'en no Shōbōtai", g: ["Action", "Sci-Fi", "Supernatural"], c: 304, cr: "Atsushi Ohkubo", y: 2015, rate: 8.01, d: "Shinra Kusakabe joins Special Fire Force Company 8 to fight Infernals born from spontaneous human combustion." },
  { t: "Dr. STONE", n: "Dr.STONE", r: "Dokutā Sutōn", g: ["Sci-Fi", "Adventure", "Comedy"], c: 232, cr: "Riichiro Inagaki & Boichi", y: 2017, rate: 8.28, d: "Scientific prodigy Senku Ishigami awakens thousands of years after humanity is petrified, determined to rebuild civilization." },
  { t: "The Promised Neverland", n: "約束のネバーランド", r: "Yakusoku no Nebārando", g: ["Mystery", "Psychological", "Horror"], c: 181, cr: "Kaiu Shirai & Posuka Demizu", y: 2016, rate: 8.21, d: "Orphans at Grace Field House uncover the horrifying truth that they are being raised as livestock for demonic beings." },
  { t: "Made in Abyss", n: "メイドインアビス", r: "Meido in Abisu", g: ["Adventure", "Dark Fantasy", "Sci-Fi"], c: 68, cr: "Akihito Tsukushi", y: 2012, rate: 8.72, d: "Riko and her robot friend Reg descend into a massive mysterious chasm filled with ancient artifacts, monsters, and curses." },
  { t: "Dandadan", n: "ダンダダン", r: "Dandadan", g: ["Action", "Comedy", "Supernatural"], c: 160, cr: "Yukinobu Tatsu", y: 2021, rate: 8.51, d: "A high school girl who believes in ghosts and a boy who believes in aliens team up when both paranormal threats prove real." },
  { t: "Sakamoto Days", n: "SAKAMOTO DAYS", r: "Sakamoto Deizu", g: ["Action", "Comedy"], c: 180, cr: "Yuto Suzuki", y: 2020, rate: 8.44, d: "A legendary retired hitman who became a chubby convenience store owner must protect his quiet family life from relentless bounty hunters." },
  { t: "Kaiju No. 8", n: "怪獣8号", r: "Kaijū Hachi-gō", g: ["Action", "Sci-Fi"], c: 110, cr: "Naoya Matsumoto", y: 2020, rate: 8.12, d: "A 32-year-old cleanup crew worker ingests a monster parasite, gaining the ability to transform into a humanoid Kaiju." },
  { t: "Witch Hat Atelier", n: "とんがり帽子のアトリエ", r: "Tongari Bōshi no Atorie", g: ["Fantasy", "Adventure"], c: 80, cr: "Kamome Shirahama", y: 2016, rate: 8.76, d: "A village girl named Coco accidentally petrifies her mother with forbidden magic and apprentice under a master witch to save her." },
  { t: "Blue Period", n: "ブルーピリオド", r: "Burū Periodo", g: ["Drama", "School", "Slice of Life"], c: 68, cr: "Tsubasa Yamaguchi", y: 2017, rate: 8.64, d: "Popular high schooler Yatora Yaguchi discovers an unexpected passion for fine art and aims for the ultra-competitive Tokyo University of the Arts." },
  { t: "Oshi no Ko", n: "【推しの子】", r: "Oshi no Ko", g: ["Drama", "Mystery", "Psychological"], c: 166, cr: "Aka Akasaka & Mengo Yokoyari", y: 2020, rate: 8.53, d: "A doctor reincarnates as the twin child of his favorite idol and enters the ruthless entertainment industry to uncover her murder." },
  { t: "Kaguya-sama: Love Is War", n: "かぐや様は告らせたい", r: "Kaguya-sama wa Kokurasetai", g: ["Comedy", "Romance", "Psychological"], c: 281, cr: "Aka Akasaka", y: 2015, rate: 8.89, d: "Two proud genius student council leaders engage in elaborate psychological warfare to force the other to confess their love first." },
  { t: "Horimiya", n: "ホリミヤ", r: "Horimiya", g: ["Romance", "Comedy", "School"], c: 122, cr: "HERO & Daisuke Hagiwara", y: 2011, rate: 8.48, d: "A popular girl and a pierced, tattooed loner discover each other's secret personas outside school and form a sweet bond." },
  { t: "Komi Can't Communicate", n: "古見さんは、コミュ症です。", r: "Komi-san wa, Komyushō desu.", g: ["Comedy", "Slice of Life", "School"], c: 460, cr: "Tomohito Oda", y: 2016, rate: 8.16, d: "An extraordinarily beautiful girl suffering from extreme social anxiety tries to make 100 friends with the help of her classmate Tadano." },
  { t: "Grand Blue Dreaming", n: "ぐらんぶる", r: "Guran Buru", g: ["Comedy", "Slice of Life"], c: 92, cr: "Kenji Inoue & Kimitake Yoshioka", y: 2014, rate: 9.02, d: "Iori Kitahara heads to college expecting a romantic beach life, only to be swept into a raucous scuba diving club driven by alcohol and chaos." },
  { t: "Great Teacher Onizuka", n: "GTO", r: "Gurēto Chīchā Onizuka", g: ["Comedy", "Drama", "School"], c: 200, cr: "Tohru Fujisawa", y: 1997, rate: 8.88, d: "Former biker gang leader Eikichi Onizuka becomes a teacher to meet high school girls, but ends up solving students' deepest crises." },
  { t: "Rurouni Kenshin", n: "るろうに剣心", r: "Rurōni Kenshin", g: ["Action", "Historical", "Martial Arts"], c: 255, cr: "Nobuhiro Watsuki", y: 1994, rate: 8.61, d: "A wandering swordsman who swore never to kill again wields a reverse-blade sword to protect the innocent in Meiji-era Japan." },
  { t: "Yu Yu Hakusho", n: "幽☆遊☆白書", r: "Yū Yū Hakusho", g: ["Action", "Supernatural", "Martial Arts"], c: 175, cr: "Yoshihiro Togashi", y: 1990, rate: 8.45, d: "Fourteen-year-old delinquent Yusuke Urameshi dies saving a child and earns a second chance at life as an Underworld Spirit Detective." },
  { t: "Inuyasha", n: "犬夜叉", r: "Inuyasha", g: ["Action", "Adventure", "Supernatural"], c: 558, cr: "Rumiko Takahashi", y: 1996, rate: 8.21, d: "Modern schoolgirl Kagome falls into an ancient well and journeys through feudal Japan with the half-demon Inuyasha to collect the Shikon Jewel." },
  { t: "Parasyte", n: "寄生獣", r: "Kiseijū", g: ["Action", "Horror", "Sci-Fi"], c: 64, cr: "Hitoshi Iwaaki", y: 1988, rate: 8.58, d: "Shinichi Izumi must co-exist with a sentient alien parasite named Migi that invaded his right hand while battling deadly parasitical cannibals." },
  { t: "Ajin: Demi-Human", n: "亜人", r: "Ajin", g: ["Action", "Horror", "Psychological"], c: 86, cr: "Gamon Sakurai", y: 2012, rate: 8.29, d: "Kei Nagai discovers he is an immortal 'Ajin' after surviving a fatal truck accident, triggering a manhunt by military black-ops forces." },
  { t: "Blame!", n: "BLAME!", r: "Buramu!", g: ["Sci-Fi", "Cyberpunk", "Action"], c: 66, cr: "Tsutomu Nihei", y: 1997, rate: 8.44, d: "Killy wanders endlessly through a vast, labyrinthine megastructure seeking humans with the Net Terminal Gene to halt runaway biomechanical architecture." },
  { t: "Battle Angel Alita", n: "銃夢", r: "Ganmu", g: ["Sci-Fi", "Cyberpunk", "Action"], c: 53, cr: "Yukito Kishiro", y: 1990, rate: 8.48, d: "In the Scrapyard beneath the sky city of Zalem, cyborg hunter-warrior Alita reclaims her lost memories through lethal martial combat." },
  { t: "Uzumaki", n: "うずまき", r: "Uzumaki", g: ["Horror", "Supernatural", "Psychological"], c: 19, cr: "Junji Ito", y: 1998, rate: 8.41, d: "The coastal town of Kurouzu-cho becomes consumed by a bizarre, hypnotic curse involving repeating spiral patterns." },
  { t: "Hell's Paradise: Jigokuraku", n: "地獄楽", r: "Jigokuraku", g: ["Action", "Supernatural", "Historical"], c: 127, cr: "Yuji Kaku", y: 2018, rate: 8.38, d: "Gabimaru the Hollow is sentenced to explore a nightmarish, supernatural island to retrieve the Elixir of Immortality for a royal pardon." },
  { t: "Mashle: Magic and Muscles", n: "マッシュル -MASHLE-", r: "Masshuru", g: ["Action", "Comedy", "Fantasy"], c: 162, cr: "Hajime Komoto", y: 2020, rate: 7.95, d: "Born without magic in a magic-dominated realm, Mash Burnedead lifts weights to overpower elite sorcerers with pure brute muscle." },
  { t: "Undead Unluck", n: "アンデッドアンラック", r: "Andeddo Anrakku", g: ["Action", "Comedy", "Supernatural"], c: 220, cr: "Yoshifumi Tozuka", y: 2020, rate: 8.16, d: "An immortal zombie unable to die and an unluck girl whose touch causes fatal accidents team up against a mysterious world-altering organization." },
  { t: "Record of Ragnarok", n: "終末のワルキューレ", r: "Shūmatsu no Warukyūre", g: ["Action", "Martial Arts", "Supernatural"], c: 92, cr: "Shinya Umemura & Takumi Fukui", y: 2017, rate: 8.24, d: "Thirteen legendary humans engage in one-on-one death matches against 13 gods to prevent the extinction of humanity." },
  { t: "Kagurabachi", n: "カグラバチ", r: "Kagurabachi", g: ["Action", "Dark Fantasy", "Supernatural"], c: 48, cr: "Takeru Hokazono", y: 2023, rate: 8.47, d: "Chihiro Rokuhira wields enchanted katanas forged by his murdered father to wage a bloody vengeance campaign against a sorcery cartel." },
  { t: "Centuria", n: "センチュリア", r: "Senchuria", g: ["Action", "Dark Fantasy"], c: 25, cr: "Tohru Kuramori", y: 2024, rate: 8.31, d: "A stowaway boy bonded to hundred souls battles monstrous leviathans across a brutal medieval high seas fantasy setting." },
  { t: "Blue Box", n: "アオのハコ", r: "Ao no Hako", g: ["Sports", "Romance", "School"], c: 160, cr: "Kouji Miura", y: 2021, rate: 8.35, d: "Badminton player Taiki Inomata falls for basketball star Chinatsu Kano, whose sudden stay at his house sparks high school romance." },
  { t: "The Dangers in My Heart", n: "僕の心のヤバイやつ", r: "Boku no Kokoro no Yabai Yatsu", g: ["Romance", "Comedy", "School"], c: 145, cr: "Norio Sakurai", y: 2018, rate: 8.65, d: "An awkward middle school boy with violent fantasies finds himself unexpectedly drawn to the class's cheerful, eccentric top model." },
  { t: "Golden Kamuy", n: "ゴールデンカムイ", r: "Gōruden Kamui", g: ["Action", "Historical", "Adventure"], c: 314, cr: "Satoru Noda", y: 2014, rate: 8.78, d: "Russo-Japanese war veteran 'Immortal Sugimoto' and an Ainu hunter girl search Hokkaido for stolen gold marked on tattooed convicts." },
  { t: "Dorohedoro", n: "ドロヘドロ", r: "Dorohedoro", g: ["Action", "Dark Fantasy", "Comedy"], c: 167, cr: "Q Hayashida", y: 2000, rate: 8.62, d: "In the grim city of the Hole, reptilian-headed Caiman hunts magic users with his partner Nikaido to recover his memories and true face." },
  { t: "Land of the Lustrous", n: "宝石の国", r: "Hōseki no Kuni", g: ["Action", "Fantasy", "Sci-Fi"], c: 108, cr: "Haruko Ichikawa", y: 2012, rate: 8.84, d: "In a distant future, humanoid immortal gemstone beings wage unending war against the Moon Dwellers who harvest their crystal bodies." },
  { t: "Mushishi", n: "蟲師", r: "Mushishi", g: ["Supernatural", "Mystery", "Slice of Life"], c: 50, cr: "Yuki Urushibara", y: 1999, rate: 8.79, d: "Ginko travels Japan studying primitive lifeforms known as Mushi and curing the bizarre supernatural afflictions they cause humans." },
  { t: "March Comes in Like a Lion", n: "3月のライオン", r: "Sangatsu no Raion", g: ["Drama", "Slice of Life"], c: 195, cr: "Chica Umino", y: 2007, rate: 8.92, d: "Seventeen-year-old professional shogi prodigy Rei Kiriyama finds solace and emotional warmth through the kindness of three neighbor sisters." },
  { t: "Initial D", n: "頭文字D", r: "Inisharu Dī", g: ["Action", "Sports"], c: 719, cr: "Shuichi Shigeno", y: 1995, rate: 8.42, d: "Tofu delivery boy Takumi Fujiwara dominates midnight downhill mountain drift races in his father's tuned Toyota Sprinter Trueno AE86." },
  { t: "Hajime no Ippo", n: "はじめの一歩", r: "Hajime no Ippo", g: ["Sports", "Action", "Comedy"], c: 1460, cr: "George Morikawa", y: 1989, rate: 8.82, d: "Bullied student Ippo Makunouchi is introduced to boxing by pro champion Takamura, beginning an epic rise to world title contention." },
  { t: "Pluto", n: "PLUTO", r: "Purūto", g: ["Mystery", "Sci-Fi", "Psychological"], c: 65, cr: "Naoki Urasawa & Osamu Tezuka", y: 2003, rate: 8.81, d: "Europol detective Gesicht investigates a string of murders targeting the world's seven greatest robots and their human supporters." },
  { t: "Billy Bat", n: "BILLY BAT", r: "Birī Batto", g: ["Mystery", "Historical", "Psychological"], c: 165, cr: "Naoki Urasawa & Takashi Nagasaki", y: 2008, rate: 8.35, d: "Comic book artist Kevin Yamagata discovers his bat character is tied to ancient prophetic scrolls and world-shaping conspiracies." },
  { t: "A Silent Voice", n: "聲の形", r: "Koe no Katachi", g: ["Drama", "School"], c: 62, cr: "Yoshitoki Oima", y: 2013, rate: 8.93, d: "A former elementary school bully seeks redemption by reuniting with and supporting the deaf girl he tormented years earlier." },
  { t: "To Your Eternity", n: "不滅のあなたへ", r: "Fumetsu no Anata e", g: ["Drama", "Fantasy", "Supernatural"], c: 190, cr: "Yoshitoki Oima", y: 2016, rate: 8.45, d: "An immortal entity capable of taking the form of dying beings journeys across civilizations learning human emotion and purpose." },
  { t: "Your Lie in April", n: "四月は君の嘘", r: "Shigatsu wa Kimi no Uso", g: ["Drama", "Music", "Romance"], c: 44, cr: "Naoshi Arakawa", y: 2011, rate: 8.68, d: "A traumatized piano prodigy unable to hear the sound of his playing meets a free-spirited violinist who brings color back to his life." },
  { t: "Fruits Basket", n: "フルーツバスケット", r: "Furūtsu Basuketto", g: ["Drama", "Romance", "Supernatural"], c: 136, cr: "Natsuki Takaya", y: 1998, rate: 8.52, d: "Tohru Honda lives with the Sohma family, discovering that thirteen members are cursed to transform into animals of the Chinese Zodiac." },
  { t: "Nana", n: "NANA", r: "Nana", g: ["Drama", "Music", "Romance"], c: 84, cr: "Ai Yazawa", y: 2000, rate: 8.85, d: "Two young women sharing the name Nana move to Tokyo and share an apartment as their lives intertwine through rock music and romance." },
  { t: "Bocchi the Rock!", n: "ぼっち・ざ・ろっく!", r: "Bocchi za Rokku!", g: ["Comedy", "Music", "Slice of Life"], c: 75, cr: "Aki Hamaji", y: 2017, rate: 8.45, d: "Extremely introverted guitarist Hitori Gotoh joins the indie rock group Kessoku Band to overcome her crippling social phobia." },
  { t: "Gintama", n: "銀魂", r: "Gintama", g: ["Action", "Comedy", "Sci-Fi"], c: 704, cr: "Hideaki Sorachi", y: 2003, rate: 8.95, d: "Silver-haired samurai Gintoki Sakata runs an odd-jobs freelancer business in an alternate Edo period dominated by alien conquerors." },
  { t: "Black Clover", n: "ブラッククローバー", r: "Burakku Kurōbā", g: ["Action", "Fantasy", "Comedy"], c: 375, cr: "Yūki Tabata", y: 2015, rate: 7.98, d: "Born without a drop of magic in a magical world, Asta receives a five-leaf grimoire imbued with anti-magic to become the Wizard King." },
  { t: "Assassination Classroom", n: "暗殺教室", r: "Ansatsu Kyōshitsu", g: ["Action", "Comedy", "School"], c: 180, cr: "Yūsei Matsui", y: 2012, rate: 8.42, d: "Junior high misfits are tasked with assassinating their tentacled, Mach-20 speed teacher Koro-sensei before he vaporizes the Earth." }
];

// Expand Manga to 260 by programmatic variations of legendary manga series
const ADDITIONAL_MANGA_TITLES = [
  "Homunculus", "Blade of the Immortal", "Lone Wolf and Cub", "Shigurui", "Sun-Ken Rock", "Origin", "Terraformars", "Deadman Wonderland", "Mirai Nikki", "Elfen Lied", "Erased", "Btooom!", "Alice in Borderland", "Liar Game", "Kaiji: Ultimate Survivor", "Akagi", "Usogui", "Tomodachi Game", "Kakegurui", "Darwin's Game", "Battle in 5 Seconds After Meeting", "I Am a Hero", "Highschool of the Dead", "Apocalypse no Toride", "Blood on the Tracks", "The Flowers of Evil", "Happiness", "Inside Mari", "Boy's Abyss", "Solanin", "Dead Dead Demon's Dededede Destruction", "Downfall", "Orange", "Blue Spring Ride", "Kimi ni Todoke", "Say I Love You", "Maid Sama!", "Ouran High School Host Club", "Paradise Kiss", "Given", "I Want to Eat Your Pancreas", "Josee the Tiger and the Fish", "K-On!", "Yuru Camp", "Non Non Biyori", "Flying Witch", "Chihayafuru", "Detective Conan", "Kindaichi Case Files", "Golgo 13", "Lupin III", "City Hunter", "Cat's Eye", "Fist of the North Star", "Devilman", "Dororo", "Black Jack", "Astro Boy", "Phoenix", "Beelzebub", "Katekyo Hitman Reborn!", "Toriko", "World Trigger", "Magi: The Labyrinth of Magic", "The Seven Deadly Sins", "Blue Exorcist", "Noragami", "Ushio and Tora", "Kekkaishi", "Nurarihyon no Mago", "Shaman King", "Eyeshield 21", "Diamond no Ace", "Captain Tsubasa", "Ashita no Joe", "Real", "Ping Pong", "MF Ghost", "Wangan Midnight", "Bakuman", "The Disastrous Life of Saiki K.", "Aposimz", "Knights of Sidonia", "Biomega", "Planetes", "Space Brothers", "Inuyashiki", "Helck", "The Lucifer and Biscuit Hammer", "Spirit Circle", "Sengoku Youko", "Shangri-La Frontier", "Mushoku Tensei: Jobless Reincarnation", "That Time I Got Reincarnated as a Slime", "Overlord", "The Eminence in Shadow", "So I'm a Spider, So What?", "Reincarnated as a Sword", "Campfire Cooking in Another World", "Skeleton Knight in Another World", "Trapped in a Dating Sim", "The World's Finest Assassin", "The Faraway Paladin", "Grimgar of Fantasy and Ash", "Log Horizon", "Goblin Slayer", "The Rising of the Shield Hero", "Arifureta: From Commonplace to World's Strongest", "Is It Wrong to Try to Pick Up Girls in a Dungeon?", "No Game No Life", "KonoSuba: God's Blessing on this Wonderful World!", "Sword Art Online: Progressive", "Fate/stay night: Heaven's Feel", "Tsukihime", "Kara no Kyoukai", "Tenkaichi: Nihon Saikyou Bugeisha Ketteisen", "Majo Taisen: The War of Greedy Witches", "Tokyo Duel", "Rosen Garten Saga", "Baki the Grappler", "Baki Hanma", "Kengan Ashura", "Kengan Omega", "Kubo Won't Let Me Be Invisible", "Shikimori's Not Just a Cutie", "Don't Toy with Me, Miss Nagatoro", "Rent-a-Girlfriend", "The Quintessential Quintuplets", "We Never Learn", "Nisekoi", "Toradora!", "Anohana: The Flower We Saw That Day", "5 Centimeters per Second", "The Garden of Words", "Weathering with You", "Your Name", "Somali and the Forest Spirit", "A Place Further than the Universe", "Lucky Star", "Nichijou: My Ordinary Life", "Daily Lives of High School Boys", "Bobobo-bo Bo-bobo", "Kochikame", "Crayon Shin-chan", "Doraemon", "Master Keaton", "Asadora!", "Gamble Fish", "Real Account", "Sweet Home", "Kozure Ookami", "Basilisk: The Kouga Ninja Scrolls", "Gleipnir", "Biokiller", "School-Live!", "Trail of Blood", "Strobe Edge", "Vampire Knight", "Kamisama Kiss", "Yona of the Dawn", "Snow White with the Red Hair", "The Ancient Magus' Bride", "Barakamon", "Silver Spoon", "Major", "Baby Steps", "Days", "Aoashi", "Giant Killing", "One Outs", "Touhai: Densetsu no Janshi", "Saki", "Choujin X", "Gokurakugai", "Astro Royale", "Kill Blue", "Nue's Exorcist", "Kyokou Suiri: In/Spectre", "Kemono Jihen", "Shadows House", "Call of the Night", "Summer Time Rendering", "Heavenly Delusion", "Trigun Maximum", "Hellsing", "Drifters", "Gunsmith Cats", "Crying Freeman", "Sanctuary", "Ichi the Killer", "Shamo", "Holyland", "All You Need Is Kill", "Tokyo ESP", "Ga-Rei", "Psyren", "Medaka Box", "Sket Dance", "Saiki Kusuo no Sai-nan", "Gantz:E", "Gantz:G", "Ajin: File 00", "Chainsaw Man: Buddy Stories", "Look Back", "Goodbye, Eri", "Just Listen to the Song", "Fire Punch", "Dungeon Meshi: World Guide", "Frieren: Anthology", "Sousou no Frieren: Prelude", "Tokyo Babylon", "X/1999", "Cardcaptor Sakura", "Magic Knight Rayearth", "Chobits", "Tsubasa: Reservoir Chronicle", "xxxHOLiC", "Pandora Hearts", "Vanitas no Carte", "Black Butler", "Rozen Maiden", "Gosick", "Kamisama no Memochou", "Durarara!!", "Baccano!", "Blood Blockade Battlefront", "Kekkai Sensen", "Gunnm: Last Order", "Gunnm: Mars Chronicle", "Abara", "NOiSE", "Biomega Zero", "Digimortal"
];

// ======================== MANHWA TITLES (260 distinct titles) ========================
const MANHWA_RAW = [
  { t: "Solo Leveling", n: "나 혼자만 레벨업", r: "Na Honjaman Rebeleop", g: ["Action", "Fantasy", "System"], c: 179, cr: "Chugong & DUBU (REDICE STUDIO)", y: 2018, rate: 9.28, d: "Sung Jinwoo, the weakest E-rank hunter in the world, receives a mysterious quest log only visible to him that allows him to level up endlessly." },
  { t: "Omniscient Reader's Viewpoint", n: "전지적 독자 시점", r: "Jeonjijeok Dokja Sijeom", g: ["Action", "Fantasy", "Apocalypse"], c: 220, cr: "sing N song & Sleepy-C", y: 2020, rate: 9.35, d: "Kim Dokja is the sole reader who finished an obscure webnovel. When the apocalyptic story becomes reality, only he knows how the world will end." },
  { t: "Tower of God", n: "신의 탑", r: "Sin-ui Tap", g: ["Action", "Adventure", "Fantasy"], c: 630, cr: "SIU", y: 2010, rate: 8.92, d: "Twenty-Fifth Bam enters an enormous, treacherous tower to reunite with his only friend Rachel, braving lethal trials on each floor." },
  { t: "The Beginning After the End", n: "끝이 아닌 시작", r: "Kkeut-i Anin Sijak", g: ["Action", "Fantasy", "Isekai"], c: 190, cr: "TurtleMe & Fuyuki23", y: 2018, rate: 8.95, d: "King Grey, a legendary monarch in a martial world, reincarnates as Arthur Leywin in a magical realm teeming with beasts and hidden threats." },
  { t: "The Boxer", n: "더 복서", r: "Deo Bokseo", g: ["Sports", "Psychological", "Drama"], c: 104, cr: "JH", y: 2019, rate: 9.12, d: "Yu, an emotionally detached boy with peerless kinetic vision, is taken under the wing of legendary boxing trainer K to dominate the ring." },
  { t: "Wind Breaker", n: "윈드브레이커", r: "Windeu Beureikeo", g: ["Sports", "Action", "Drama"], c: 505, cr: "Jo Yongseok", y: 2013, rate: 9.08, d: "Model student Jay Jo is roped into street cycling, discovering camaraderie, underground bike crews, and high-speed downhill racing." },
  { t: "Lookism", n: "외모지상주의", r: "Oemojisangjuui", g: ["Action", "Drama", "Supernatural"], c: 515, cr: "Park Taejun", y: 2014, rate: 8.65, d: "Bullied and overweight Daniel Park awakens to find he has two bodies: one handsome and athletic, the other his original form." },
  { t: "Eleceed", n: "일렉시드", r: "Illeksideu", g: ["Action", "Comedy", "Supernatural"], c: 310, cr: "Son Jeho & ZHENA", y: 2018, rate: 9.15, d: "Kindhearted Jiwoo, who possesses lightning speed, rescues a wounded fat orange cat who is secretly Kayden, the world's strongest awakened warrior." },
  { t: "Return of the Blossoming Blade", n: "화산귀환", r: "Hwasan Gwigwan", g: ["Action", "Martial Arts", "Historical"], c: 140, cr: "Biga & LICO", y: 2021, rate: 9.22, d: "Chung Myung, the Plum Blossom Sword Saint of the Mount Hua Sect, reincarnates a century later to find his revered sect completely ruined." },
  { t: "Nano Machine", n: "나노마신", r: "Nanomasin", g: ["Action", "Martial Arts", "Sci-Fi"], c: 220, cr: "Jeolmu Hyeon & Geum Gangbulgoe", y: 2020, rate: 8.84, d: "Cheon Yeo-woon of the Demonic Cult is injected with futuristic nanomachine technology by a descendant, unlocking godlike martial mastery." },
  { t: "The Greatest Estate Developer", n: "역대급 영지 설계사", r: "Yeokdaegeup Yeongji Seolgyesa", g: ["Comedy", "Fantasy", "Isekai"], c: 155, cr: "BK_Moon & Lee Hyunmin", y: 2021, rate: 9.38, d: "Civil engineering student Suho Kim wakes up as Lloyd Frontera, a debt-ridden noble scumbag, and uses modern construction methods to build wealth." },
  { t: "SSS-Class Suicide Hunter", n: "SSS급 죽어야 사는 헌터", r: "SSS-geup Jugeoya Saneun Heonteo", g: ["Action", "Fantasy", "Psychological"], c: 115, cr: "Shin Noah & Bill K", y: 2020, rate: 9.19, d: "Kim Gong-ja gains an S-class skill to copy abilities upon dying, repeatedly rewinding time to conquer the Tower while saving tragic souls." },
  { t: "Doom Breaker", n: "투신전생기", r: "Tusin Jeonsaenggi", g: ["Action", "Fantasy", "Reincarnation"], c: 100, cr: "Cheong Dam", y: 2021, rate: 9.05, d: "Zephyr, the last human champion against the Demon God, is sent back in time by bored deities to replay his battle for humanity's survival." },
  { t: "Murim Login", n: "무림 로그인", r: "Murim Rogeuin", g: ["Action", "Martial Arts", "Comedy"], c: 185, cr: "ZERO-BIG & Cheol Bumseok", y: 2020, rate: 8.98, d: "Jin Tae-kyung discovers a hyper-realistic VR capsule that transports his consciousness into a ruthless martial arts world where power translates to reality." },
  { t: "Legend of the Northern Blade", n: "북검전기", r: "Bukgeomjeongi", g: ["Action", "Martial Arts", "Revenge"], c: 195, cr: "Woo Gak & Hae Min", y: 2019, rate: 9.32, d: "Jin Mu-won silently masters his father's forgotten Northern Heavenly Sect martial arts in isolation, preparing to claim vengeance against conspirators." },
  { t: "Peerless Dad", n: "아비무쌍", r: "Abimussang", g: ["Action", "Martial Arts", "Slice of Life"], c: 275, cr: "Noh Kyungchan & Lee Hyunseok", y: 2017, rate: 8.78, d: "A widowed martial artist takes on bodyguard duties for a merchant guild, completely unaware of his own legendary strength, just to feed his triplets." },
  { t: "Gosu", n: "고수", r: "Gosu", g: ["Action", "Martial Arts", "Comedy"], c: 233, cr: "Ryu Ki-un & Moon Jung-hoo", y: 2015, rate: 8.71, d: "Gang Ryong masters supreme martial arts to avenge his poisoned master, only to learn his targets are already dead, so he works at a dumpling shop." },
  { t: "Overgeared", n: "템빨", r: "Temppal", g: ["Action", "Fantasy", "Virtual Reality"], c: 240, cr: "Park Saenal & Team Argo", y: 2020, rate: 8.74, d: "Shin Youngwoo uncovers the legendary Pagma's Successor class in the VR game Satisfy, forging god-tier equipment to become an unstoppable titan." },
  { t: "Second Life Ranker", n: "두 번 사는 랭커", r: "Du Beon Saneun Raengkeo", g: ["Action", "Fantasy", "Revenge"], c: 175, cr: "Sadoyeon & Nongnong", y: 2019, rate: 8.65, d: "Cha Yeon-woo enters the Obelisk of the Sun God after receiving his murdered twin brother's pocket watch and diary, swearing retribution." },
  { t: "Pick Me Up! Infinite Gacha", n: "픽 미 업!", r: "Pik Mi Eop!", g: ["Action", "Fantasy", "System"], c: 105, cr: "Hermod & Narak", y: 2022, rate: 9.18, d: "The top-ranked master player of the punishing gacha mobile game 'Pick Me Up' gets summoned into the game as a disposable 1-star hero." },
  { t: "Tyrant of the Tower Defense Game", n: "타워 디펜스 게임의 폭군이 되었다", r: "Tawo Dipenseu Geim-ui Pokgun-i Doeeotda", g: ["Fantasy", "Strategy", "Military"], c: 100, cr: "Harapa & Kim Gyun-pyo", y: 2022, rate: 9.15, d: "After clearing an impossible hell-mode tower defense game, a gamer wakes up as Prince Ash, defending a ruined border city from monster hordes." },
  { t: "Surviving the Game as a Barbarian", n: "게임 속 바바리안으로 살아남기", r: "Geim Sok Babarian-euro Saranamgi", g: ["Action", "Dark Fantasy", "Survival"], c: 85, cr: "Jung Dong-won & Midnight Studio", y: 2023, rate: 9.12, d: "Transported into an ultra-hardcore roguelike RPG as a muscle-bound barbarian named Bjorn, a veteran gamer must fight tooth and nail to survive." },
  { t: "Revenge of the Iron-Blooded Sword Hound", n: "철혈검가 사냥개의 회귀", r: "Cheolhyeolgeomga Sanyanggae-ui Hoegwi", g: ["Action", "Dark Fantasy", "Reincarnation"], c: 95, cr: "Leguin & Lee Seul-gi", y: 2023, rate: 8.98, d: "Vikir, a loyal hound of the Iron-Blooded Baskerville family, is executed by his master. Reincarnated into his youth, he plans bloody retribution." },
  { t: "Infinite Mage", n: "무한의 마법사", r: "Muhan-ui Mabeopsa", g: ["Fantasy", "Magic", "School"], c: 80, cr: "Kim Chi-woo & Kirin", y: 2022, rate: 9.02, d: "Shiro, an abandoned child raised by commoners, awakens an infinite mental space that allows him to deconstruct and manipulate magic particles." },
  { t: "Academy's Undercover Professor", n: "아카데미에 위장취업당했다", r: "Akademie Wijangchwieopdanghaetda", g: ["Action", "Fantasy", "Mystery"], c: 105, cr: "Blue Needle & Sayren", y: 2022, rate: 9.05, d: "A secret operative assuming the identity of a missing teacher accidentally lands a job at the continent's most prestigious magic academy." },
  { t: "Trash of the Count's Family", n: "백작가의 망나니가 되었다", r: "Baekjakga-ui Mangnaniga Doeeotda", g: ["Fantasy", "Comedy", "Isekai"], c: 130, cr: "Yoo Ryeo Han & PAN4", y: 2020, rate: 9.21, d: "Kim Roksoo awakens as Cale Henituse, the drunkard trash son of a count, and schemes to live a peaceful slacker life while saving the world." },
  { t: "Who Made Me a Princess", n: "어느 날 공주가 되어버렸다", r: "Eoneu Nal Gongjuga Doeeobeoryeotda", g: ["Fantasy", "Romance", "Isekai"], c: 125, cr: "Plutus & Spoon", y: 2017, rate: 9.15, d: "A modern woman awakens as Athanasia, a tragic princess destined to be executed by her cold-blooded tyrant emperor father Claude." },
  { t: "The Remarried Empress", n: "재혼 황후", r: "Jaehon Hwanghu", g: ["Drama", "Romance", "Fantasy"], c: 180, cr: "Alphatart & Sumpul", y: 2019, rate: 9.11, d: "When Emperor Sovieshu divorces Empress Navier to marry a runaway slave mistress, Navier accepts the divorce on one condition: remarrying the neighboring King." },
  { t: "Villains Are Destined to Die", n: "악역의 엔딩은 죽음뿐", r: "Ak-yeog-ui Ending-eun Jugeumpkun", g: ["Drama", "Romance", "Fantasy"], c: 155, cr: "Gwon Gyeoeul & SUOL", y: 2020, rate: 9.31, d: "Penelope Eckhart awakens as the despised adopted villainess of a ruthless ducal family in a hard-mode reverse harem dating sim." },
  { t: "Your Throne", n: "하루만 네가 되고 싶어", r: "Haruman Nega Doego Sipeo", g: ["Drama", "Psychological", "Fantasy"], c: 205, cr: "SAM", y: 2020, rate: 9.18, d: "Ruthless lady Medea Solon and fragile saintess Psyche Callista swap bodies, unraveling royal conspiracies, power grabs, and palace corruption." },
  { t: "Under the Oak Tree", n: "상수리나무 아래", r: "Sangsuri Namu Arae", g: ["Romance", "Drama", "Fantasy"], c: 100, cr: "Kim Suji & P", y: 2020, rate: 9.08, d: "Maximilian, the stuttering, mistreated daughter of a duke, is married off to peasant-born knight Riftan Calypso before he departs for war." },
  { t: "A Business Proposal", n: "사내 맞선", r: "Sanae Matseon", g: ["Romance", "Comedy"], c: 102, cr: "Hae Hwa & NARAK", y: 2018, rate: 8.75, d: "Shin Ha-ri attends a blind date disguised as her wild best friend to scare the suitor away, only to find the date is her company's workaholic CEO." },
  { t: "What's Wrong with Secretary Kim", n: "김 비서가 왜 그럴까", r: "Kim Biseoga Wae Geureolkka", g: ["Romance", "Comedy"], c: 98, cr: "Jung Kyung-yoon & Kim Myung-mi", y: 2016, rate: 8.68, d: "Narcissistic vice-chairman Lee Young-joon is blindsided when his ultra-competent personal secretary of nine years suddenly tenders her resignation." },
  { t: "True Beauty", n: "여신강림", r: "Yeosin-gangrim", g: ["Romance", "Comedy", "Drama"], c: 223, cr: "Yaongyi", y: 2018, rate: 8.41, d: "After being bullied for her looks, Jugyeong masters makeup through online tutorials and transforms into an untouchable high school goddess." },
  { t: "Bastard", n: "후레자식", r: "Hurejasik", g: ["Psychological", "Thriller", "Horror"], c: 93, cr: "Carnby Kim & Youngchan Hwang", y: 2014, rate: 9.25, d: "Seon Woo is forced to assist his charismatic, wealthy father, who is secretly a ruthless serial killer targeting young women." },
  { t: "Sweet Home", n: "스위트홈", r: "Seuwiteuhom", g: ["Horror", "Action", "Psychological"], c: 140, cr: "Carnby Kim & Youngchan Hwang", y: 2017, rate: 9.12, d: "A suicidal high school recluse in a rundown apartment complex must band together with neighbors when residents mutate into grotesque monsters." },
  { t: "Shotgun Boy", n: "엽총소년", r: "Yeopchong Sonyeon", g: ["Action", "Horror", "Thriller"], c: 68, cr: "Carnby Kim & Hongpil", y: 2021, rate: 8.85, d: "A heavily bullied boy flees into the woods during a school trip, finds a shotgun, and becomes humanity's last hope against shape-shifting flesh-eaters." },
  { t: "Mercenary Enrollment", n: "입학용병", r: "Iphak Yongbyeong", g: ["Action", "Drama", "School"], c: 205, cr: "YC & Rakhyun", y: 2020, rate: 8.94, d: "Yu Ijin, the sole survivor of a plane crash who spent a decade as an elite child mercenary, returns home to Korea to attend high school." },
  { t: "Viral Hit", n: "싸움독학", r: "Ssaumdoghak", g: ["Action", "Comedy", "School"], c: 218, cr: "Park Taejun & Kim Junghyun", y: 2019, rate: 8.89, d: "Bullied student Hobin Yoo stumbles upon an obscure, deleted NewTube channel teaching real street fighting techniques and goes viral." },
  { t: "Weak Hero", n: "약한영웅", r: "Yakhan Yeong-ung", g: ["Action", "Drama", "School"], c: 260, cr: "SEOPASS & RAZEN", y: 2018, rate: 9.12, d: "Gray Yeon, a physically frail academic prodigy, dismantles violent high school gangs and thugs using brutal psychological tactics and everyday tools." }
];

const ADDITIONAL_MANHWA_TITLES = [
  "Manager Kim", "Questism", "Reality Quest", "Juvenile Offender", "My Life as a Loser", "Pigpen", "Flawed Almighty", "Rotten", "Hellbound", "All of Us Are Dead", "Hive", "Dead Days", "Distant Sky", "Leviathan (Lee Gyuntak)", "Promised Orchid", "Trinity Wonder", "Blade of the Phantom Master", "Island", "Priest", "Witch Hunter", "The Breaker", "The Breaker: New Waves", "The Breaker: Eternal Force", "Veritas", "Sun-Ken Rock: Korean Saga", "Mujang", "Dokgo", "Tong", "Blood Rain", "Dear Boy", "Boss in School", "Study Group", "Hanlim Gym", "To Not Die", "Get Schooled", "Castle", "Plaza Wars", "God of Blackfield", "The Bully In-Charge", "Designated Bully", "DICE: The Cube that Changes Everything", "Hardcore Leveling Warrior", "X & Ash", "The Gamer", "Level 1 Player", "Max Level Returner", "Player Who Returned 10,000 Years Later", "Limit Breaker", "Poison-Eating Healer", "The Constellation That Returned From Hell", "Memorize", "The Second Coming of Gluttony", "Auto Hunting With My Clones", "Solo Bug Player", "I Stole the Number One Ranker's Soul", "Return of the Disaster-Class Hero", "Kill the Hero", "Seoul Station Necromancer", "Seoul Station Druid", "The Lone Necromancer", "Boundless Necromancer", "Catastrophic Necromancer", "I Obtained a Mythic Item", "The S-Classes That I Raised", "Tomb Raider King", "Leveling With the Gods", "Ranker Who Lives a Second Time", "The Player That Can't Level Up", "I'm the Grim Reaper", "Jungle Juice", "Hero Has Returned", "Swordmaster's Youngest Son", "Reaper of the Drifting Moon", "Poison Dragon: Legend of an Asura", "Bowblade Spirit", "Volcanic Age", "Chronicles of Heavenly Demon", "Tale of a Scribe Who Retires to the Countryside", "Heavenly Martial God", "Wandering Warrior of Wudang", "Heavenly Demon Cultivation Simulation", "Absolute Sword Sense", "Demonic Master of Mount Kunlun", "Record of the War God", "Reborn as the Heavenly Demon", "Return of the Mad Demon", "Lightning Degree", "Doctor's Rebirth", "Martial Streamer", "Murim RPG Simulation", "I Reincarnated as the Crazed Heir", "Champion's Path to Murim", "Gosu: The Master", "Ruler of the Land", "Yongbi the Invincible", "Red Storm", "Survival Story of a Sword King in a Fantasy World", "Standard of Reincarnation", "Damn Reincarnation", "Worthless Regression", "The Demon Prince goes to the Academy", "The Extra's Academy Survival Guide", "Necromancer Academy's Genius Summoner", "Magic Academy's Genius Blinker", "The Novel's Extra", "The Author's POV", "Trapped in a Webnovel as a Good-for-Nothing", "Roxana", "Father, I Don't Want this Marriage", "A Stepmother's Marchen", "I Shall Master this Family", "Kill the Villainess", "Beware of the Villainess!", "Secret Lady", "The Reason Why Raeliana Ended up at the Duke's Mansion", "Doctor Elise: The Royal Lady with the Lamp", "The Villainess Reverses the Hourglass", "What It Takes to Be a Villainess", "Ebony", "Light & Shadow", "Golden Time", "Like Wind on a Dry Branch", "Positively Yours", "Cheese in the Trap", "Something About Us", "A Good Day to be a Dog", "See You in My 19th Life", "Super Secret", "Seasons of Blossom", "Operation: True Love", "After School Lessons for Unripe Apples", "Devil Number 4", "Refund High School", "Freaking Romance", "Lore Olympus", "UnOrdinary", "SubZero", "Siren's Lament", "Age Matters", "I Love Yoo", "Purple Hyacinth", "My In-Laws Are Obsessed With Me", "I'm Stanning the Prince", "For My Derelict Favorite", "Tricked into Becoming the Heroine's Stepmother", "The Perks of Being an S-Class Heroine", "The Max Level Hero has Returned!", "Reformation of the Deadbeat Noble", "The Stellar Swordmaster", "The Knight King Who Returned with a God", "Dark Mortal", "Flow", "City of Dead Sorcerer", "Lessa", "Kubera", "Magician", "Knight Run", "Denma", "God of Bath", "The Sound of Your Heart", "Yumi's Cells", "Daily JoJo", "Touching Your Smile", "Spirit Fingers", "Top Management", "Debut or Die", "Be the Actor", "King of Drama", "Medical Return", "Dr. Choi Tae-soo", "Trauma Center: Golden Hour", "Perfect Surgeon", "Great Doctor Ling Ran", "God of Pro Wrestling", "King of the Octagon", "How to Live as a Villain", "Reincarnated as the Unruly Heir", "Return of the Bachelor", "Tomb of the Divine Beasts", "The Legend of the White-Haired Demon", "Stormy Sea", "Nine Heavens Sword Master", "Peerless Sword God", "Master of Gu: Korea", "The Reincarnated Assassin is a Genius Swordsman", "Player from Today Onwards", "Reincarnated Veteran Soldier", "I Became the Tyrant of a Defense Game", "Pick Me Up! Infinite Gacha: Side Story", "Surviving as a Mage in a Magic Academy", "Revenge of the Baskerville", "Sword King of Another World", "Leveling Up Alone", "The Grandmaster of Martial Arts", "Tales of the Heavenly Demon Emperor", "Ascent of the God Hand", "Blade of Wind and Rain", "Blood River Martial Court", "The Chronicles of the Mad Emperor", "The Supreme God of Murim", "The Return of the Mount Hua Genius", "Heavenly Demon's Descendant", "Nine Dragons Martial Arts", "Gale Force Martial Saint", "White Tiger Clan Reborn"
];

// ======================== MANHUA TITLES (260 distinct titles) ========================
const MANHUA_RAW = [
  { t: "Tales of Demons and Gods", n: "妖神记", r: "Yāo Shén Jì", g: ["Cultivation", "Action", "Fantasy"], c: 480, cr: "Mad Snail", y: 2015, rate: 8.84, d: "Nie Li, killed by the Sage Emperor, reincarnates into his 13-year-old self in Glory City, using vast knowledge to protect his friends and cultivate godlike strength." },
  { t: "Soul Land", n: "斗罗大陆", r: "Dòuluō Dàlù", g: ["Fantasy", "Action", "Martial Arts"], c: 350, cr: "Tang Jia San Shao", y: 2011, rate: 8.92, d: "Tang San, disciple of the Tang Sect martial arts clan, jumps off a cliff to atone for stealing secret lore and reincarnates into the spirit realm of Douluo Dalu." },
  { t: "Battle Through the Heavens", n: "斗破苍穹", r: "Dòupò Cāngqióng", g: ["Cultivation", "Action", "Martial Arts"], c: 420, cr: "Tian Can Tu Dou", y: 2012, rate: 8.88, d: "Xiao Yan, who unexpectedly lost his prodigious cultivation powers, discovers the ring of Yao Lao and rises to become the supreme Flame Emperor." },
  { t: "Martial Peak", n: "武炼巅峰", r: "Wǔ Liàn Diānfēng", g: ["Cultivation", "Action", "Martial Arts"], c: 3750, cr: "Momo & Pikapi", y: 2018, rate: 8.54, d: "Yang Kai, a lowly sweeper disciple at Lingxiao Pavilion, discovers a mysterious black book that sets him on the arduous journey to the martial peak." },
  { t: "Apotheosis", n: "百炼成神", r: "Bǎi Liàn Chéng Shén", g: ["Cultivation", "Action", "Fantasy"], c: 1100, cr: "Enci & Ranzai Studio", y: 2015, rate: 8.61, d: "Luo Zheng, formerly a young master reduced to a human punching bag slave, accidentally transforms himself into an indestructible weapon refinement artifact." },
  { t: "I am the Fated Villain", n: "我！天命大反派", r: "Wǒ! Tiānmìng Dà Fǎnpài", g: ["Cultivation", "Action", "Psychological"], c: 210, cr: "Tianming", y: 2021, rate: 9.15, d: "Gu Changge transmigrates as the young master of the Immortal Gu Family and discovers he is cast as the ultimate villain doomed to be crushed by protagonists." },
  { t: "Magic Emperor", n: "魔皇大管家", r: "Mó Huáng Dà Guǎnjiā", g: ["Cultivation", "Action", "Psychological"], c: 540, cr: "Ye Xiao", y: 2019, rate: 9.21, d: "Zhuo Yifan, the ruthless Demonic Emperor, is betrayed by his disciple and reincarnated into the feeble body of a loyal family steward named Zhuo Fan." },
  { t: "Yuan Zun", n: "元尊", r: "Yuán Zūn", g: ["Cultivation", "Action", "Fantasy"], c: 450, cr: "Tian Can Tu Dou", y: 2017, rate: 8.78, d: "Zhou Yuan, Prince of the Great Zhou Empire born with the Sacred Dragon blessing stolen by the Great Wu, unlocks his eight meridians to reclaim his throne." },
  { t: "Grandmaster of Demonic Cultivation", n: "魔道祖师", r: "Mó Dào Zǔ Shī", g: ["Fantasy", "Historical", "Supernatural"], c: 260, cr: "Mo Xiang Tong Xiu", y: 2017, rate: 9.25, d: "Wei Wuxian, the grandmaster who founded the demonic cultivation path, is summoned into the body of a lunatic and reunites with his solemn rival Lan Wangji." },
  { t: "Heaven Official's Blessing", n: "天官赐福", r: "Tiān Guān Cì Fú", g: ["Fantasy", "Romance", "Historical"], c: 120, cr: "Mo Xiang Tong Xiu & STARember", y: 2019, rate: 9.35, d: "Xie Lian, the twice-banished crown prince who ascended to godhood three times as a laughingstock, meets the terrifying ghost king Hua Cheng." },
  { t: "The Daily Life of the Immortal King", n: "仙王的日常生活", r: "Xiān Wáng de Rìcháng Shēnghuó", g: ["Comedy", "Cultivation", "School"], c: 220, cr: "Kuxuan", y: 2020, rate: 8.42, d: "Wang Ling, who defeated a demon king at age six, struggles to suppress his cosmic spiritual energy to live an ordinary high school life eating crispy noodles." },
  { t: "A Will Eternal", n: "一念永恒", r: "Yī Niàn Yǒnghéng", g: ["Comedy", "Cultivation", "Action"], c: 410, cr: "Er Gen", y: 2018, rate: 8.89, d: "Bai Xiaochun is terrified of dying, and his comical obsession with longevity leads him to perform reckless experiments that terrify whole cultivation sects." },
  { t: "Perfect World", n: "完美世界", r: "Wánměi Shìjiè", g: ["Cultivation", "Action", "Fantasy"], c: 260, cr: "Chen Dong", y: 2014, rate: 8.85, d: "Shi Hao, a child prodigy whose Supreme Being Bone was cruelly stolen by his relatives, grows up drinking beast milk in Stone Village before conquering the cosmos." },
  { t: "Shrouding the Heavens", n: "遮天", r: "Zhē Tiān", g: ["Cultivation", "Sci-Fi", "Action"], c: 240, cr: "Chen Dong", y: 2012, rate: 8.68, d: "Nine dragon corpses pulling an ancient bronze coffin descend from outer space on Mount Tai, transporting Ye Fan across stars to the Big Dipper realm." },
  { t: "Renegade Immortal", n: "仙逆", r: "Xiān Nì", g: ["Cultivation", "Action", "Dark Fantasy"], c: 180, cr: "Er Gen", y: 2018, rate: 8.95, d: "Wang Lin, an ordinary boy devoid of talent, stumbles upon the Heavenly Defying Bead and pursues the ruthless Dao of Slaughter across centuries." },
  { t: "Against the Gods", n: "逆天邪神", r: "Nì Tiān Xié Shén", g: ["Cultivation", "Action", "Harem"], c: 500, cr: "Mars Gravity", y: 2015, rate: 8.42, d: "Yun Che, reincarnated twice with the Sky Poison Pearl and the Evil God's divine veins, defies the heavens to protect those he cherishes." },
  { t: "Martial God Asura", n: "修罗武神", r: "Xiūluó Wǔshén", g: ["Cultivation", "Action", "Martial Arts"], c: 800, cr: "Kindhearted Bee", y: 2016, rate: 8.21, d: "Chu Feng, deemed worthless because his dantian lay dormant, awakens nine mysterious lightning dragons and slaughterous Asura world spirits." },
  { t: "Peerless Martial God", n: "绝世武神", r: "Juéshì Wǔshén", g: ["Cultivation", "Action", "Reincarnation"], c: 680, cr: "Jing Wu Hen", y: 2016, rate: 8.32, d: "Lin Feng, betrayed in his past life, reincarnates in the Continent of the Nine Clouds with twin spirits and carves a blood-soaked path to the divine." },
  { t: "Stellar Transformations", n: "星辰变", r: "Xīngchén Biàn", g: ["Cultivation", "Action", "Fantasy"], c: 310, cr: "I Eat Tomatoes", y: 2013, rate: 8.65, d: "Qin Yu, unable to cultivate internal dantian energy, trains his physical body to the extreme until he absorbs the meteoric tear of a fallen god." },
  { t: "Lord Xue Ying", n: "雪鹰领主", r: "Xuě Yīng Lǐngzhǔ", g: ["Cultivation", "Action", "Fantasy"], c: 240, cr: "I Eat Tomatoes", y: 2016, rate: 8.58, d: "Dongbo Xueying practices the spear day and night in the Tranquil Sun Province to rescue his imprisoned parents from the Mo Yang Clan." },
  { t: "Swallowed Star", n: "吞噬星空", r: "Tūnshì Xīngkōng", g: ["Sci-Fi", "Cultivation", "Action"], c: 220, cr: "I Eat Tomatoes", y: 2020, rate: 8.92, d: "After the Great Nirvana mutated Earth's beasts, Luo Feng awakens spirit reader talents and ascends from planetary defense to galactic dominion." },
  { t: "Wu Dong Qian Kun", n: "武动乾坤", r: "Wǔ Dòng Qiánkūn", g: ["Cultivation", "Action", "Fantasy"], c: 380, cr: "Tian Can Tu Dou", y: 2015, rate: 8.72, d: "Lin Dong discovers an enigmatic stone talisman in a pool cave, transforming him from an underdog clan youth into the savior of the universe." },
  { t: "The Great Ruler", n: "大主宰", r: "Dà Zhǔzǎi", g: ["Cultivation", "Action", "Fantasy"], c: 360, cr: "Tian Can Tu Dou", y: 2014, rate: 8.69, d: "Mu Chen journeys from the Northern Spiritual Realm to the Great Thousand World, wielding ancient divine birds and sovereign celestial bodies." },
  { t: "Star Martial God Technique", n: "星武神诀", r: "Xīng Wǔ Shén Jué", g: ["Cultivation", "Action", "Fantasy"], c: 600, cr: "Mad Snail", y: 2016, rate: 8.35, d: "Ye Xinghe cultivates the rare Star Martial Art, standing against tyrannical flame and dragon martial artists in a crumbling empire." },
  { t: "Lord of the Mysteries", n: "诡秘之主", r: "Guǐmì zhī Zhǔ", g: ["Mystery", "Steampunk", "Supernatural"], c: 110, cr: "Cuttlefish That Loves Diving", y: 2020, rate: 9.42, d: "Zhou Mingrui awakens in Victorian-era Backlund as Klein Moretti, navigating tarot card gatherings, potion advancement pathways, and eldritch gods." },
  { t: "Release That Witch", n: "放开那个女巫", r: "Fàngkāi Nàgè Nǚwū", g: ["Fantasy", "Isekai", "Kingdom Building"], c: 520, cr: "Er Mu", y: 2019, rate: 9.08, d: "Modern mechanical engineer Cheng Yan transmigrates as Prince Roland Wimbledon, utilizing persecuted witches' magical powers to spark an industrial revolution." },
  { t: "Versatile Mage", n: "全职法师", r: "Quánzhí Fǎshī", g: ["Action", "Magic", "School"], c: 1150, cr: "Chaos", y: 2017, rate: 8.52, d: "Mo Fan awakens in a modern world where science has been replaced by magic, discovering he can awaken lightning and fire affinities simultaneously." },
  { t: "The King's Avatar", n: "全职高手", r: "Quánzhí Gāoshǒu", g: ["Gaming", "Action", "Comedy"], c: 260, cr: "Butterfly Blue", y: 2015, rate: 8.91, d: "Ye Xiu, the God-level captain of Glory esports team Excellent Era, is forced out, starting over at an internet cafe as an unspecialized player." },
  { t: "Spare Me, Great Lord!", n: "大王饶命", r: "Dàwáng Ráomìng", g: ["Comedy", "Action", "Supernatural"], c: 750, cr: "The Speaking Pork Trotter", y: 2018, rate: 8.82, d: "Lu Shu earns cultivation points by collecting negative emotions from others, becoming the world's most delightfully annoying cultivator." },
  { t: "Cultivation Chat Group", n: "修真聊天群", r: "Xiūzhēn Liáotiān Qún", g: ["Comedy", "Cultivation", "Slice of Life"], c: 560, cr: "Legend of the Paladin", y: 2017, rate: 8.89, d: "Song Shuhang is accidentally added to an online group chat where members discuss alchemy, lightning tribulations, and pill refinement as reality." },
  { t: "Top Tier Providence", n: "顶级气运，悄悄修炼千年", r: "Dǐngjí Qìyùn, Qiāoqiāo Xiūliàn Qiānnián", g: ["Comedy", "Cultivation", "System"], c: 170, cr: "Let Me Laugh", y: 2022, rate: 9.15, d: "Reincarnated into a cultivation realm, Han Jue rolls top-tier luck and resolves to stay locked in his cave abode to cultivate quietly for ten thousand years." },
  { t: "I'm Actually a Cultivation Bigshot", n: "原来我是修仙大佬", r: "Yuánlái Wǒ Shì Xiūxiān Dàlǎo", g: ["Comedy", "Cultivation", "Slice of Life"], c: 240, cr: "Yin Beidou", y: 2021, rate: 8.84, d: "Li Nianfan believes he is just a mortal who cooks and writes poems, unaware that immortals worship his tea as supreme Dao enlightenment." },
  { t: "Invincible at the Start", n: "开局就无敌", r: "Kāijú Jiù Wúdí", g: ["Action", "Comedy", "Cultivation"], c: 190, cr: "Fei Xiang", y: 2021, rate: 8.75, d: "Chen Changan gains an invincible domain where he possesses godlike omnipotence, trolling supreme sect ancestors who dare intrude." },
  { t: "Beyond Myriad Peoples", n: "万古最强宗", r: "Wàngǔ Zuìqiáng Zōng", g: ["Comedy", "Cultivation", "Action"], c: 260, cr: "Jiang Hu Zai Jian", y: 2020, rate: 8.81, d: "Jun Changxiao is bound to a sect system and must develop the Ironbone Sect into the strongest sect under heaven or his heart will explode." },
  { t: "All Hail the Sect Leader", n: "掌门低调点", r: "Zhǎngmén Dīdiào Diǎn", g: ["Comedy", "Cultivation", "Action"], c: 210, cr: "Badao", y: 2021, rate: 8.78, d: "A transmigrated gamer becomes a low-profile sect leader and recruits prodigies destined to become future emperors and heavenly gods." },
  { t: "Rebirth of the Urban Immortal Cultivator", n: "重生之都市修仙", r: "Chóngshēng zhī Dūshì Xiūxiān", g: ["Action", "Urban", "Cultivation"], c: 920, cr: "Ten Lies", y: 2017, rate: 8.12, d: "Chen Fan, who reached the pinnacle of the cultivation cosmos, fails his tribulation and returns to his teenage school days on Earth." },
  { t: "I'm an Evil God", n: "我！天命反派", r: "Wǒ! Dà Xiégém", g: ["Action", "Transmigration", "Martial Arts"], c: 450, cr: "Shidai Man Wang", y: 2019, rate: 9.32, d: "Xie Yan transmigrates across multiple dimensional planes, playing villainous and manipulative roles to gather source points." },
  { t: "Ultimate Scheming System", n: "最强反套路系统", r: "Zuì Qiáng Fǎn Tàolù Xìtǒng", g: ["Comedy", "Cultivation", "Action"], c: 610, cr: "Tai Shang Bu Lao", y: 2018, rate: 8.45, d: "Xu Que activates the Tough-Acting System, growing in power whenever he breaks conventional cultivation cliches and acts shamelessly cool." },
  { t: "Library of Heaven's Path", n: "天道图书馆", r: "Tiāndào Túshūguǎn", g: ["Comedy", "Fantasy", "School"], c: 310, cr: "Heng Sao Tian Ya", y: 2018, rate: 8.68, d: "Zhang Xuan transmigrates as a disgraced academy teacher and discovers a library in his mind that compiles flawless books on anything he examines." },
  { t: "Reverend Insanity", n: "蛊真人", r: "Gǔ Zhēnrén", g: ["Dark Fantasy", "Cultivation", "Psychological"], c: 96, cr: "Gu Zhen Ren", y: 2018, rate: 9.48, d: "Fang Yuan, a five-hundred-year-old demonic Gu master, uses the Spring Autumn Cicada to rebirth into his youth, driven solely by the pursuit of eternal life." }
];

const ADDITIONAL_MANHUA_TITLES = [
  "Custom Made Demon King", "Starting Today I'll Work as a City Lord", "Bug Player (Chinese)", "Super Gene", "I Have a Mansion in the Post-Apocalyptic World", "The Last Human", "Dark Star Emperor", "King of Manifestations", "Everlasting God of Sword", "God of Martial Arts", "Dominate the Three Realms", "Nine Sun God King", "Peerless Battle Spirit", "Sovereign of the Three Realms", "Chaotic Sword God", "Emperor's Domination", "Transmigrating to the Ancient Times", "The Ghostly Doctor", "Pu Fei Fei", "Song of the Long March", "Blades of the Guardians", "Feng Shen Ji", "City of Darkness", "The Ravages of Time", "Blood and Steel", "Bloodline", "Rakshasa Street", "Fox Spirit Matchmaker", "Cupid's Chocolates", "Spiritpact", "Die Now", "School Beauty's Personal Expert", "The Demon King Who Lost His Job", "My Wife is a Demon Queen", "I Was Trash", "Rebirth: City Deity", "Metropolitan System", "Dragon King's Son-in-Law", "The Sacred Ruins", "World of Cultivation", "A Record of a Mortal's Journey to Immortality", "Coiling Dragon", "Desolate Era", "Ancient Godly Monarch", "Dragon Marked War God", "Nine Star Hegemon Body Art", "God of Slaughter", "Great Demon King", "Warlock of the Magus World", "Nan Hao & Shang Fei", "19 Days", "SQ: Begin With Your Name", "Here U Are", "Song of the Sky Pacers", "Journey to the West: Asura", "Westward", "Shan Hai Ni Zhan", "Outblaze", "Silver Gravekeeper", "Monster List", "Vampire Sphere", "Lan Chi", "Once Upon a Time in Lingjian Mountain", "Cheating Craft", "Aishen Qiaokeli", "Nine Dragons God Emperor", "The Great Demon King", "Sovereign of All Realms", "Martial Movement Upheaval", "True Martial World", "Immortal Mortal", "History's Number 1 Founder", "Tales of the Reincarnated Lord", "Forty Millenniums of Cultivation", "Star Gate", "Ascent of the Heaven Trampling", "Unrivaled Medicine God", "Peerless Martial Soul", "The Heavenly Demon Can't Live a Normal Life (Manhua)", "Nine Heavens Martial God", "Peerless Heavenly Sovereign", "Martial Master: Wu Shen Zhu Zai", "Supreme God Emperor", "Supreme Soul", "Spirit Sword Sovereign", "One Step Toward Freedom", "The Peak of True Martial Arts", "Ten Thousand Worlds", "Against the Sky Supreme", "Alchemy Supreme", "Proud Emperor", "The Galaxy Emperor", "Carp Reborn", "Tomb of Fallen Gods", "Defiance of the Fall (Chinese)", "Dragon's Disciple", "Soul Land 2: The Peerless Tang Sect", "Soul Land 3: Legend of the Dragon King", "Soul Land 4: Ultimate Douluo", "Soul Land 5: Rebirth of Tang San", "Battle Through the Heavens: Return of the Beasts", "Battle Through the Heavens: Prequel", "The Great Ruler: Grand Desolation", "Martial Universe: Ancient Battlefield", "Swallowed Star: Domain of Beasts", "Stellar Transformations: Realm of Immortals", "Lord Xue Ying: Realm of the Gods", "Perfect World: Boundless Wilderness", "Shrouding the Heavens: Ancient Star of Purple Tenuity", "Renegade Immortal: Domain of slaughter", "A Will Eternal: River-Defying Sect", "I am the Fated Villain: Upper Realm", "Magic Emperor: Seven Houses War", "Tales of Demons and Gods: Draconic Ruins Realm", "Martial Peak: Star Boundary", "Apotheosis: Higher World", "Versatile Mage: Parthenon Temple", "The King's Avatar: Challenger League", "Spare Me, Great Lord!: Dahei Forest", "Top Tier Providence: Chaos Realm", "Beyond Myriad Peoples: Sky Realm", "Keep a Low Profile, Sect Leader", "It Starts with a Mountain", "Don't Dare to Provoke Me", "The Strongest Hero Ever", "I Have Countless Clones", "I am a Great God", "My Disciples Are All Big Villains", "I am the Heavenly Demon", "Super God Gene", "World's Apocalypse Online", "My Girlfriend is a Zombie", "First Order (Manhua)", "I'm Picked by the Gods", "Peerless Genius Doctor", "Medical Martial Supreme", "God of Gamblers: Urban", "Immortal King: Urban Rebirth", "Dragon God System", "The God of Deceit", "The Strongest Ancestor", "Almighty Sword Domain", "Dominating the Martial Dao: Chinese", "Ancient Godly King", "The Nine Suns", "Supreme Sword God", "Heavenly Sovereign", "Peerless King of the Wilderness", "The Dragon Monarch", "Demon Hunter: Manhua Edition", "Word of Honor: Animated Comic", "The Blood of Youth: Comic", "Legend of the Dark River: Comic"
];

// ======================== DONGHUA TITLES (260 distinct titles) ========================
const DONGHUA_RAW = [
  { t: "Soul Land", n: "斗罗大陆", r: "Dòuluō Dàlù", g: ["Action", "Fantasy", "Martial Arts"], c: 260, cr: "Sparkly Key Animation / Tencent Video", y: 2018, rate: 9.32, d: "Tang San masters Twin Martial Souls and spirit rings alongside the Shrek Seven Devils to triumph in the Continental Advanced Spirit Master Academy Elite Tournament." },
  { t: "Battle Through the Heavens", n: "斗破苍穹", r: "Dòupò Cāngqióng", g: ["Action", "Fantasy", "Cultivation"], c: 130, cr: "Foch Film / Motion Magic", y: 2017, rate: 9.28, d: "Xiao Yan masters Heavenly Flames across the Tagor Desert and Jia Ma Empire to avenge his mother and fulfill his three-year agreement with Nalan Yanran." },
  { t: "Link Click", n: "时光代理人", r: "Shíguāng Dàilǐrén", g: ["Supernatural", "Mystery", "Drama"], c: 24, cr: "Studio LAN & Haoliners", y: 2021, rate: 9.41, d: "Cheng Xiaoshi and Lu Guang use time-jumping photography abilities inside 'Time Photo Studio' to fulfill client requests while desperately avoiding altering the future." },
  { t: "The King's Avatar", n: "全职高手", r: "Quánzhí Gāoshǒu", g: ["Action", "Gaming"], c: 24, cr: "G.CMay Animation & B.CMAY", y: 2017, rate: 9.12, d: "Disgraced esports pro Ye Xiu builds his legendary unspecialized character 'Lord Grim' in Glory's tenth server, shocking the professional scene." },
  { t: "Grandmaster of Demonic Cultivation", n: "魔道祖师", r: "Mó Dào Zǔ Shī", g: ["Action", "Historical", "Supernatural"], c: 35, cr: "B.CMAY PICTURES", y: 2018, rate: 9.36, d: "Wei Wuxian and Lan Wangji investigate a dismembered, cursed arm, uncovering a sinister conspiracy behind the devastation of the great cultivation clans." },
  { t: "Heaven Official's Blessing", n: "天官赐福", r: "Tiān Guān Cì Fú", g: ["Fantasy", "Romance", "Supernatural"], c: 24, cr: "Haoliners Animation League", y: 2020, rate: 9.38, d: "Xie Lian descends to the mortal realm to investigate eerie disappearances of brides on Mount Yujun, accompanied by the mysterious youth San Lang." },
  { t: "A Will Eternal", n: "一念永恒", r: "Yī Niàn Yǒnghéng", g: ["Comedy", "Cultivation", "Action"], c: 106, cr: "B.CMAY PICTURES", y: 2020, rate: 9.15, d: "Bai Xiaochun lights incense to summon an immortal master, beginning a hilarious cultivation adventure where his sheer terror of dying leads to godlike alchemy." },
  { t: "Perfect World", n: "完美世界", r: "Wánměi Shìjiè", g: ["Action", "Cultivation", "Fantasy"], c: 170, cr: "Foch Film", y: 2021, rate: 9.24, d: "Born into the desolate Stone Village, Shi Hao reclaims his stolen Supreme Being bone and confronts archaic divine beasts in boundless wild domains." },
  { t: "Swallowed Star", n: "吞噬星空", r: "Tūnshì Xīngkōng", g: ["Sci-Fi", "Action", "Cultivation"], c: 130, cr: "Sparkly Key Animation", y: 2020, rate: 9.25, d: "Luo Feng ascends from an impoverished Jiangnan city fighter to Earth's planetary champion, piloting advanced mecha and cosmic combat gear." },
  { t: "Renegade Immortal", n: "仙逆", r: "Xiān Nì", g: ["Action", "Cultivation", "Dark Fantasy"], c: 52, cr: "Build Dream Studio", y: 2023, rate: 9.35, d: "Wang Lin cultivates the ruthless path of slaughter to avenge his clan, defying the divine heavens with cold, calculating tactical genius." },
  { t: "Shrouding the Heavens", n: "遮天", r: "Zhē Tiān", g: ["Sci-Fi", "Cultivation", "Action"], c: 68, cr: "Sparkly Key Animation", y: 2023, rate: 9.18, d: "Ye Fan is taken across the cosmic void by nine dragon corpses pulling an ancient bronze coffin, discovering cultivation sects on ancient stars." },
  { t: "A Record of a Mortal's Journey to Immortality", n: "凡人修仙传", r: "Fánrén Xiūxiān Zhuàn", g: ["Cultivation", "Action", "Adventure"], c: 102, cr: "Original Force", y: 2020, rate: 9.34, d: "Han Li, an ordinary boy with no pedigree, relies on caution, patience, and a mysterious green vial that matures herbs instantly to survive deadly sects." },
  { t: "Wu Dong Qian Kun: Martial Universe", n: "武动乾坤", r: "Wǔ Dòng Qiánkūn", g: ["Action", "Cultivation", "Fantasy"], c: 48, cr: "Motion Magic", y: 2019, rate: 8.95, d: "Lin Dong uses the mysterious stone talisman to master martial techniques, challenging the prestigious Lin Clan and demonic sect conquerors." },
  { t: "The Great Ruler", n: "大主宰", r: "Dà Zhǔzǎi", g: ["Action", "Cultivation", "Fantasy"], c: 52, cr: "Foch Film", y: 2023, rate: 9.02, d: "Mu Chen awakens the spirit of the Nine Nether Bird and battles through the Northern Spiritual Academy to rise above the heavens." },
  { t: "Stellar Transformations", n: "星辰变", r: "Xīngchén Biàn", g: ["Action", "Cultivation", "Fantasy"], c: 60, cr: "Foch Film", y: 2018, rate: 8.89, d: "Qin Yu absorbs the magical Meteoric Tear, overcoming physical limitations to master external martial arts and attain godhood." },
  { t: "Lord Xue Ying", n: "雪鹰领主", r: "Xuě Yīng Lǐngzhǔ", g: ["Action", "Cultivation", "Fantasy"], c: 78, cr: "Mili Pictures", y: 2018, rate: 8.82, d: "Dongbo Xueying trains relentlessly with the spear to protect his younger brother and rescue his parents from the Mo Yang clan's citadel." },
  { t: "Spare Me, Great Lord!", n: "大王饶命", r: "Dàwáng Ráomìng", g: ["Comedy", "Supernatural", "Action"], c: 24, cr: "Big Firebird Cultural Media", y: 2021, rate: 9.12, d: "Lu Shu exploits a system that rewards him for eliciting distress and annoyance from opponents, rising during an era of global magical awakening." },
  { t: "The Daily Life of the Immortal King", n: "仙王的日常生活", r: "Xiān Wáng de Rìcháng Shēnghuó", g: ["Comedy", "School", "Supernatural"], c: 48, cr: "Haoliners & Pb Animation", y: 2020, rate: 8.58, d: "Wang Ling tries to suppress his universe-destroying spiritual aura while navigating bizarre school competitions and demonic invasions." },
  { t: "Scissor Seven", n: "刺客伍六七", r: "Cìkè Wǔ Liùqī", g: ["Comedy", "Action", "Drama"], c: 40, cr: "Sharefun Studio", y: 2018, rate: 9.21, d: "An amnesiac barber on Chicken Island wields telekinetic scissors to take on cut-rate assassination contracts, hiding his past as the deadliest shadow killer." },
  { t: "Fog Hill of Five Elements", n: "雾山五行", r: "Wù Shān Wǔ Xíng", g: ["Action", "Historical", "Supernatural"], c: 8, cr: "Samsara Animation Studio", y: 2020, rate: 9.45, d: "Wen Ren Yu Xuan, envoy of fire, unleashes breathtaking brush-stroke elemental martial arts against ancient monsters who stole the Holy Kirin child." },
  { t: "Rakshasa Street", n: "镇魂街", r: "Zhèn Hún Jiē", g: ["Action", "Supernatural"], c: 36, cr: "L2Studio", y: 2016, rate: 8.89, d: "Cao Yan Bing guards Requiem Street, summoning legendary Three Kingdoms warrior spirits to protect souls transitioning between realms." },
  { t: "Fox Spirit Matchmaker", n: "狐妖小红娘", r: "Húyāo Xiǎo Hóngniáng", g: ["Romance", "Comedy", "Supernatural"], c: 145, cr: "Haoliners Animation League", y: 2015, rate: 8.78, d: "Fox spirits act as matchmakers helping humans and spirits reincarnate together, unraveling ancient romantic tragedies." },
  { t: "White Cat Legend", n: "大理寺日志", r: "Dàlǐ Sì Rìzhì", g: ["Mystery", "Comedy", "Historical"], c: 24, cr: "Nice Boat Animation", y: 2020, rate: 8.92, d: "In Tang Dynasty Luoyang, a humanoid white cat acts as the sharp-witted Vice Minister of the Court of Judicial Review solving bizarre imperial crimes." },
  { t: "Blades of the Guardians", n: "镖人", r: "Biāo Rén", g: ["Action", "Historical", "Martial Arts"], c: 15, cr: "Colored-Pencil Animation Design", y: 2023, rate: 9.15, d: "Ddao, an outlaw warrior armed with four swords, accepts an escort mission across the desert during the tyrannical Sui Dynasty." },
  { t: "The Island of Siliang", n: "眷思量", r: "Juàn Sīliàng", g: ["Fantasy", "Mystery", "Romance"], c: 15, cr: "Year Young Culture", y: 2021, rate: 9.08, d: "Exiled gods and mortals on a punitive island seek ways to escape the heavenly sea barrier before they age and perish." },
  { t: "Ling Cage: Incarnation", n: "灵笼", r: "Líng Lóng", g: ["Sci-Fi", "Action", "Post-Apocalyptic"], c: 16, cr: "YHKT Entertainment", y: 2019, rate: 9.28, d: "Human survivors aboard a floating city called the Lighthouse send Hunter squads down to the monster-infested Earth for essential resources." },
  { t: "The Outcast", n: "一人之下", r: "Yī Rén Zhī Xià", g: ["Action", "Supernatural", "Martial Arts"], c: 48, cr: "Haoliners / Big Firebird", y: 2016, rate: 8.85, d: "Chou Soran uncovers his grandfather's secret Daoist martial arts heritage when attacked by zombies in a graveyard, meeting immortal blade wielder Feng Baobao." },
  { t: "Thousand Autumns", n: "山河剑心", r: "Shān Hé Jiàn Xīn", g: ["Martial Arts", "Historical", "Drama"], c: 16, cr: "Foch Film", y: 2021, rate: 9.12, d: "Shen Qiao, the gentle sect leader of Mount Xuandu, is betrayed and falls off a cliff, rescued by the capricious demonic sect leader Yan Wushi." },
  { t: "Scumbag System", n: "穿书自救指南", r: "Chuān Shū Zìjiù Zhǐnán", g: ["Comedy", "Fantasy", "Isekai"], c: 10, cr: "Djinn Power", y: 2020, rate: 8.65, d: "Shen Yuan transmigrates as Shen Qingqiu, a scum villain teacher destined to be brutally murdered by his disciple Luo Binghe, frantically pampering him to survive." },
  { t: "The Blood of Youth", n: "少年歌行", r: "Shàonián Gē Xíng", g: ["Action", "Martial Arts", "Historical"], c: 52, cr: "Zhongce Culture", y: 2018, rate: 9.22, d: "Four dashing young martial artists journey across the Jianghu escorting a golden coffin containing imperial and Buddhist secrets." },
  { t: "Young Brewmaster's Adventure", n: "少年白马醉春风", r: "Shàonián Bái Mǎ Zuì Chūn Fēng", g: ["Action", "Martial Arts", "Historical"], c: 20, cr: "Zhongce Culture", y: 2022, rate: 9.18, d: "Baili Dongjun, who desires only to brew the finest wine in the realm, is swept into legendary martial conflicts that forge the next era of heroes." },
  { t: "Legend of the Dark River", n: "暗河传", r: "Ànhé Zhuàn", g: ["Action", "Martial Arts", "Thriller"], c: 26, cr: "Zhongce Culture", y: 2023, rate: 9.15, d: "Su Muyu, the leader of the Umbrella Shadow guard, navigates lethal civil war inside the Dark River, the Jianghu's most ruthless assassination syndicate." },
  { t: "The Demon Hunter", n: "沧元图", r: "Cāng Yuán Tú", g: ["Action", "Cultivation", "Dark Fantasy"], c: 26, cr: "Sparkly Key Animation", y: 2023, rate: 9.42, d: "Meng Chuan vows to become a Godfiend demon hunter after his mother sacrifices herself to save his city from invading demon beast lords." },
  { t: "Song of the Broadsword", n: "枕刀歌", r: "Zhěn Dāo Gē", g: ["Action", "Martial Arts", "Historical"], c: 14, cr: "Gengxing Animation", y: 2021, rate: 9.25, d: "He Silou embarks on a merciless solo vendetta across Jianghu towns, cutting down corrupt officials and martial masters who butchered his family." },
  { t: "Throne of Seal", n: "神印王座", r: "Shén Yìn Wáng Zuò", g: ["Action", "Fantasy", "Magic"], c: 110, cr: "Sparkly Key Animation", y: 2022, rate: 9.19, d: "Long Haochen ascends as a Divine Knight of the Temple Alliance, wielding divine light against 72 demon pillars to reclaim human sovereignty." },
  { t: "Tales of Demons and Gods 3D", n: "妖神记 3D", r: "Yāo Shén Jì 3D", g: ["Action", "Fantasy", "Cultivation"], c: 280, cr: "Ruo Hong Culture", y: 2017, rate: 8.42, d: "Nie Li returns to his youth with centuries of spirit knowledge, refining demon spirits to protect Glory City." },
  { t: "Star Martial God Technique Donghua", n: "星武神诀 3D", r: "Xīng Wǔ Shén Jué 3D", g: ["Action", "Cultivation", "Fantasy"], c: 120, cr: "Ruo Hong Culture", y: 2021, rate: 8.35, d: "Ye Xinghe commands the power of ancient constellations, challenging the Dragon and Flame martial factions." },
  { t: "Nine Songs of the Moving Heavens", n: "天行九歌", r: "Tiān Xíng Jiǔ Gē", g: ["Action", "Historical", "Mystery"], c: 90, cr: "Sparkly Key Animation", y: 2016, rate: 9.15, d: "Prince Han Fei founds Quicksand to investigate mysterious murders and military sabotage in the turbulent Warring States era." },
  { t: "The Legend of Qin", n: "秦时明月", r: "Qín Shí Míng Yuè", g: ["Action", "Historical", "Martial Arts"], c: 175, cr: "Sparkly Key Animation", y: 2007, rate: 9.11, d: "Sword Saint Ge Nie and young Jing Tianming flee the Qin imperial guard across ancient China, meeting Mohist and Taoist masters." },
  { t: "Degenerate-Drawing Jianghu", n: "画江湖之不良人", r: "Huà Jiānghú zhī Bù Liáng Rén", g: ["Action", "Historical", "Martial Arts"], c: 150, cr: "Rocen", y: 2014, rate: 9.38, d: "Li Xingyun, a descendant of the Tang dynasty royal house, navigates treacherous warlords and the mysterious Bu Liang Ren imperial secret police." }
];

const ADDITIONAL_DONGHUA_TITLES = [
  "Big Fish & Begonia", "White Snake", "White Snake 2: Green Snake", "Nezha: Birth of the Demon Child", "Jiang Ziya", "New Gods: Yang Jian", "New Gods: Nezha Reborn", "Deep Sea (Shen Hai)", "Spiritpact Donghua", "Cupid's Chocolates Donghua", "Once Upon a Time in Lingjian Mountain Donghua", "Drowning Sorrows in Raging Fire", "The Defective: Can Ci Pin", "Antidote (Jie Yao)", "Legend of Exorcism", "Dinghai Fusheng Records", "Dragon Raja: The Blazing Dawn", "The Legend of Hei", "Fairies Albums: Bai Yao Pu", "Memory of Chang'an", "Cinderella Chef: Meng Qi Shi Shen", "No Doubt In Us: Liang Bu Yi", "Psychic Princess: Tong Ling Fei", "Are You Ok? (Ni Dao Di Yao Shenme)", "All Saints Street", "Non-Human: Fei Ren Zai", "The Land of Miracles", "Against the Sky Supreme", "Peerless Martial Spirit Donghua", "Ten Thousand Worlds Donghua", "The Peak of True Martial Arts Donghua", "Dominating the Martial Dao Donghua", "The Magic Chef of Ice and Fire", "Kuang Shen: Mad God", "Supreme God Emperor Donghua", "Lord of the Universe Donghua", "Wonderland of Ten Thousands Donghua", "The First Order Donghua", "Word of Honor Animated", "Cang Yuan Tu: Demon Hunter Season 2", "Zhen Dao Ge: Special Edition", "Feng Yu Zhou: Wind Guardians", "Immortal (Yong Sheng)", "Dan Dao Zhi Zun Donghua", "Martial Master: Wu Shen Zhu Zai Donghua", "Supreme Soul Donghua", "Spirit Sword Sovereign Donghua", "One Step Toward Freedom Donghua", "Starry Love Donghua", "Ancient Myth Donghua", "Everlasting God of Sword Donghua", "Proud Emperor Donghua", "The Legend of Sky Lord", "The Galaxy Emperor Donghua", "Alchemy Supreme Donghua", "Tomb of Fallen Gods Donghua", "Carp Reborn Donghua", "Soul Land 2: The Peerless Tang Sect 3D", "The Great Ruler 3D Series", "Swallowed Star: War of the Universe", "Battle Through the Heavens: Nalan Duel", "Perfect World: Seven Gods Descend", "Renegade Immortal: Sea of Devils", "Shrouding the Heavens: Desolate Ancient Forbidden Land", "A Record of a Mortal's Journey: Starfall Ocean", "Wu Dong Qian Kun: Great Desolation Monument", "Stellar Transformations: Immortal Realm", "Lord Xue Ying: Crimson Rock Mountain", "Spare Me, Great Lord! Season 2", "The Daily Life of the Immortal King Season 4", "Scissor Seven Season 4", "Fog Hill of Five Elements: Chapter of Xichuan", "Rakshasa Street Season 3", "White Cat Legend Season 2", "Blades of the Guardians Season 2", "Ling Cage: Final Chapter", "The Outcast Season 5", "Thousand Autumns Season 2", "The Blood of Youth Season 2", "Young Brewmaster's Adventure Season 2", "Legend of the Dark River Season 2", "Throne of Seal Season 2", "Tales of Demons and Gods: Nether Realm", "Star Martial God Technique: Imperial City", "Nine Songs of the Moving Heavens Season 2", "The Legend of Qin Season 6", "Degenerate-Drawing Jianghu Season 6", "Immortal: Celestial Chapter", "Martial Master: Northern Domain War", "Spirit Sword Sovereign: Star Continent", "One Step Toward Freedom: Nine Palaces", "Against the Sky Supreme: Hongmeng Realm", "Ten Thousand Worlds: Supreme Sovereign", "The Peak of True Martial Arts: Golden Crow", "The Magic Chef of Ice and Fire Season 2", "Dragon Raja Season 2", "Fairies Albums Season 3", "No Doubt In Us Season 2", "Psychic Princess Season 2", "All Saints Street Season 4", "Non-Human Season 3", "The Island of Siliang Season 2", "The Land of Miracles Season 2", "A Will Eternal Season 3", "Battle Through the Heavens: Central Plains", "Soul Land: Tang San Godhood", "Perfect World: Wilderness King", "Swallowed Star: Golden Horned Beast", "Renegade Immortal: Suzaku Star", "Shrouding the Heavens: Holy Lands War", "A Record of a Mortal's Journey: Demon Realm", "Wu Dong Qian Kun: Eastern Xuan Region", "Stellar Transformations: God Realm", "Lord Xue Ying: Deity World", "Scissor Seven: Jianghu Journey", "Blades of the Guardians: Imperial Chang'an", "Ling Cage: Earth Renewal", "The Outcast: Heavenly Master's Trial", "Thousand Autumns: Mount Xuandu", "The Blood of Youth: Overseas Immortal Mountain", "Young Brewmaster's Adventure: Heavenly Revelations", "Throne of Seal: Tower of Eternity", "The Demon Hunter: Nine Heavens Domain", "Song of the Broadsword: Capital Reckoning", "Degenerate-Drawing Jianghu: Yanshen Tomb", "Immortal: Divine Artifacts", "Martial Master: Heaven Realm Awakening", "Spirit Sword Sovereign: Emperor Domain", "One Step Toward Freedom: Eternal Peak", "Against the Sky Supreme: Supreme Vengeance", "The Peak of True Martial Arts: God King", "Dragon Raja: Bronze Dragon King", "Fairies Albums: Capital Chapter", "No Doubt In Us: North Expedition", "Psychic Princess: Spirit Mountain", "The Island of Siliang: Divine Seal Broken", "White Snake 3: Floating Life", "New Gods: Erlang Shen", "Deep Sea: Luminescence", "Soul Land 3: Legend of the Dragon King 3D", "The Great Ruler: Sovereign Assembly", "Swallowed Star: Universe Mercenary", "Battle Through the Heavens: Ancient God's Cave", "Perfect World: Boundless Sea", "Renegade Immortal: Ancient God Realm", "Shrouding the Heavens: Emperor Road", "A Record of a Mortal's Journey: Spirit Realm Passage", "Wu Dong Qian Kun: Ancestral Symbol", "Scissor Seven: Shadow Master", "Blades of the Guardians: Grand Canal", "Ling Cage: Moon Colony", "The Outcast: Eight Miracles", "The Blood of Youth: Imperial City Siege", "Throne of Seal: Demon God Emperor", "The Demon Hunter: Godfiend Trial", "Degenerate-Drawing Jianghu: End of Liang", "Immortal: Reincarnation Gate", "Martial Master: Sacred Domain Summit", "Spirit Sword Sovereign: Nine Heavens", "Against the Sky Supreme: Hongmeng Master", "Dragon Raja: King of Fire", "White Snake: Affection in Rain", "Soul Land: Continental Rebirth"
];

function buildCategoryCollection(type, rawList, additionalTitles, images, country, countryCode, lang) {
  const result = [];
  let rankCounter = 1;

  // 1. Process Raw items
  for (const item of rawList) {
    const cid = `${type}-${slugify(item.t)}`;
    const imgIndex = (rankCounter - 1) % images.length;
    const bannerIndex = (rankCounter - 1) % BANNERS.length;
    
    result.push({
      contentId: cid,
      title: item.t,
      alternativeTitles: {
        english: item.t,
        japanese: countryCode === 'JP' ? item.n : undefined,
        korean: countryCode === 'KR' ? item.n : undefined,
        chinese: countryCode === 'CN' ? item.n : undefined,
        romaji: item.r,
        synonyms: [item.r, item.n].filter(Boolean)
      },
      contentType: type,
      country: country,
      countryCode: countryCode,
      language: lang,
      description: item.d,
      image: images[imgIndex],
      banner: BANNERS[bannerIndex],
      trailer: {
        available: true,
        youtubeId: 'dQw4w9WgXcQ',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        title: `${item.t} Official Trailer`
      },
      genres: item.g,
      rating: item.rate || 8.5,
      rank: rankCounter++,
      popularity: item.pop || Math.max(78, 98 - Math.floor(rankCounter / 10)),
      releaseDate: `${item.y || 2020}-01-01`,
      releaseYear: item.y || 2020,
      status: (type === 'anime' || type === 'donghua') ? 'Airing' : 'Ongoing',
      episodes: (type === 'anime' || type === 'donghua') ? (item.c || 24) : undefined,
      chapters: (type === 'manga' || type === 'manhwa' || type === 'manhua') ? (item.c || 150) : undefined,
      duration: (type === 'anime' || type === 'donghua') ? '22 min/ep' : undefined,
      author: (type !== 'donghua') ? (item.cr || 'Famous Creator') : undefined,
      studio: (type === 'donghua' || type === 'anime') ? (item.cr || 'Top Animation Studio') : undefined,
      moodAffinities: {
        Excited: 0.9,
        Motivated: 0.85,
        Curious: 0.8
      },
      situationAffinities: {
        'Free Time': 0.95,
        'Weekend': 0.9,
        'After College': 0.85
      },
      energyAffinities: {
        'High Energy': 0.85,
        'Focused': 0.9
      },
      isTrending: rankCounter <= 25,
      isTopRated: (item.rate || 8.5) >= 9.0,
      isHiddenGem: (item.rate || 8.5) < 8.2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    });
  }

  // 2. Process Additional Titles to reach exactly 260
  const needed = 260 - result.length;
  for (let i = 0; i < needed; i++) {
    const rawTitle = additionalTitles[i] || `${type.toUpperCase()} Masterpiece Vol. ${i + 1}`;
    const cid = `${type}-${slugify(rawTitle)}`;
    
    // Check if already in result to avoid duplicate keys
    if (result.some(r => r.contentId === cid)) continue;

    const imgIndex = (rankCounter - 1) % images.length;
    const bannerIndex = (rankCounter - 1) % BANNERS.length;
    const baseRate = Number((7.8 + ((i * 17) % 19) / 10).toFixed(2));
    const year = 2012 + (i % 12);
    
    // Choose sensible genres based on category
    let genres = ["Action", "Adventure", "Fantasy"];
    if (type === 'manhua') genres = ["Cultivation", "Action", "Martial Arts"];
    else if (type === 'donghua') genres = ["Cultivation", "Action", "Fantasy"];
    else if (type === 'manhwa') genres = i % 3 === 0 ? ["Action", "System", "Fantasy"] : (i % 3 === 1 ? ["Martial Arts", "Murim", "Action"] : ["Romance", "Fantasy", "Drama"]);
    else if (type === 'manga') genres = i % 3 === 0 ? ["Action", "Shounen", "Adventure"] : (i % 3 === 1 ? ["Psychological", "Seinen", "Mystery"] : ["Romance", "Comedy", "School"]);

    result.push({
      contentId: cid,
      title: rawTitle,
      alternativeTitles: {
        english: rawTitle,
        synonyms: [rawTitle]
      },
      contentType: type,
      country: country,
      countryCode: countryCode,
      language: lang,
      description: `An epic ${type} masterpiece following extraordinary characters navigating high-stakes battles, profound mysteries, and legendary destiny in ${country}.`,
      image: images[imgIndex],
      banner: BANNERS[bannerIndex],
      trailer: {
        available: true,
        youtubeId: 'dQw4w9WgXcQ',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        title: `${rawTitle} Trailer`
      },
      genres: genres,
      rating: Math.min(9.65, Math.max(7.5, baseRate)),
      rank: rankCounter++,
      popularity: Math.max(72, 95 - Math.floor(rankCounter / 12)),
      releaseDate: `${year}-05-01`,
      releaseYear: year,
      status: (type === 'anime' || type === 'donghua') ? (i % 2 === 0 ? 'Airing' : 'Finished') : (i % 2 === 0 ? 'Ongoing' : 'Completed'),
      episodes: (type === 'anime' || type === 'donghua') ? (12 + (i % 10) * 12) : undefined,
      chapters: (type === 'manga' || type === 'manhwa' || type === 'manhua') ? (50 + (i % 20) * 15) : undefined,
      duration: (type === 'anime' || type === 'donghua') ? '22 min/ep' : undefined,
      author: (type !== 'donghua') ? `Master Author ${String.fromCharCode(65 + (i % 26))}` : undefined,
      studio: (type === 'donghua' || type === 'anime') ? `Animation Studio ${String.fromCharCode(65 + (i % 26))}` : undefined,
      moodAffinities: {
        Excited: 0.85,
        Motivated: 0.8,
        Curious: 0.8
      },
      situationAffinities: {
        'Free Time': 0.9,
        'Weekend': 0.85
      },
      energyAffinities: {
        'High Energy': 0.8,
        'Focused': 0.85
      },
      isTrending: rankCounter <= 40,
      isTopRated: baseRate >= 9.0,
      isHiddenGem: baseRate < 8.1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    });
  }

  return result.slice(0, 260);
}

// Generate the 4 categories
console.log('Generating Manga catalog (260 items)...');
const mangaItems = buildCategoryCollection('manga', MANGA_RAW, ADDITIONAL_MANGA_TITLES, MANGA_IMAGES, 'Japan', 'JP', 'Japanese');

console.log('Generating Manhwa catalog (260 items)...');
const manhwaItems = buildCategoryCollection('manhwa', MANHWA_RAW, ADDITIONAL_MANHWA_TITLES, MANHWA_IMAGES, 'South Korea', 'KR', 'Korean');

console.log('Generating Manhua catalog (260 items)...');
const manhuaItems = buildCategoryCollection('manhua', MANHUA_RAW, ADDITIONAL_MANHUA_TITLES, MANHUA_IMAGES, 'China', 'CN', 'Mandarin');

console.log('Generating Donghua catalog (260 items)...');
const donghuaItems = buildCategoryCollection('donghua', DONGHUA_RAW, ADDITIONAL_DONGHUA_TITLES, DONGHUA_IMAGES, 'China', 'CN', 'Mandarin');

// Write out modular files
const outDir = path.join(__dirname, '..', 'server', 'data');

fs.writeFileSync(
  path.join(outDir, 'mangaCatalog.ts'),
  `import { ContentItem } from '../types.js';\n\nexport const MANGA_CATALOG: ContentItem[] = ${JSON.stringify(mangaItems, null, 2)};\n`
);

fs.writeFileSync(
  path.join(outDir, 'manhwaCatalog.ts'),
  `import { ContentItem } from '../types.js';\n\nexport const MANHWA_CATALOG: ContentItem[] = ${JSON.stringify(manhwaItems, null, 2)};\n`
);

fs.writeFileSync(
  path.join(outDir, 'manhuaCatalog.ts'),
  `import { ContentItem } from '../types.js';\n\nexport const MANHUA_CATALOG: ContentItem[] = ${JSON.stringify(manhuaItems, null, 2)};\n`
);

fs.writeFileSync(
  path.join(outDir, 'donghuaCatalog.ts'),
  `import { ContentItem } from '../types.js';\n\nexport const DONGHUA_CATALOG: ContentItem[] = ${JSON.stringify(donghuaItems, null, 2)};\n`
);

console.log(`Success! Generated:
- ${mangaItems.length} Manga items
- ${manhwaItems.length} Manhwa items
- ${manhuaItems.length} Manhua items
- ${donghuaItems.length} Donghua items
Total: ${mangaItems.length + manhwaItems.length + manhuaItems.length + donghuaItems.length} items!`);
