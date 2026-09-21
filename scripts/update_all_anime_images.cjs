const fs = require('fs');
const path = require('path');

console.log('✨ Starting AniMood AI Anime/Manga/Manhwa/Donghua/Manhua image update...');

// 1. Curated specific image mappings for all key titles
const EXACT_TITLE_IMAGES = {
  // Anime
  'haikyuu': {
    image: 'https://cdn.myanimelist.net/images/anime/7/68859.jpg',
    banner: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Shoyo Hinata': 'https://cdn.myanimelist.net/images/characters/11/256747.jpg',
      'Tobio Kageyama': 'https://cdn.myanimelist.net/images/characters/14/256749.jpg',
      'Kei Tsukishima': 'https://cdn.myanimelist.net/images/characters/15/256751.jpg'
    }
  },
  'frieren': {
    image: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Frieren': 'https://cdn.myanimelist.net/images/characters/6/524317.jpg',
      'Fern': 'https://cdn.myanimelist.net/images/characters/8/524319.jpg',
      'Stark': 'https://cdn.myanimelist.net/images/characters/14/524320.jpg'
    }
  },
  'bocchi': {
    image: 'https://cdn.myanimelist.net/images/anime/1448/127956.jpg',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Hitori Gotoh': 'https://cdn.myanimelist.net/images/characters/4/491560.jpg',
      'Nijika Ijichi': 'https://cdn.myanimelist.net/images/characters/13/491562.jpg'
    }
  },
  'spyfamily': {
    image: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
    banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Loid Forger': 'https://cdn.myanimelist.net/images/characters/9/469447.jpg',
      'Anya Forger': 'https://cdn.myanimelist.net/images/characters/2/469446.jpg',
      'Yor Forger': 'https://cdn.myanimelist.net/images/characters/15/469448.jpg'
    }
  },
  'edgerunners': {
    image: 'https://cdn.myanimelist.net/images/anime/1816/123507.jpg',
    banner: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'David Martinez': 'https://cdn.myanimelist.net/images/characters/6/487319.jpg',
      'Lucy Kushinada': 'https://cdn.myanimelist.net/images/characters/12/487320.jpg',
      'Rebecca': 'https://cdn.myanimelist.net/images/characters/3/487321.jpg'
    }
  },
  'jjk': {
    image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Satoru Gojo': 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
      'Yuji Itadori': 'https://cdn.myanimelist.net/images/characters/2/422167.jpg',
      'Megumi Fushiguro': 'https://cdn.myanimelist.net/images/characters/4/422169.jpg'
    }
  },
  'aot': {
    image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Eren Yeager': 'https://cdn.myanimelist.net/images/characters/10/216895.jpg',
      'Mikasa Ackerman': 'https://cdn.myanimelist.net/images/characters/9/215563.jpg',
      'Levi Ackerman': 'https://cdn.myanimelist.net/images/characters/2/241413.jpg'
    }
  },
  'fma': {
    image: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Edward Elric': 'https://cdn.myanimelist.net/images/characters/9/72533.jpg',
      'Alphonse Elric': 'https://cdn.myanimelist.net/images/characters/5/54265.jpg',
      'Roy Mustang': 'https://cdn.myanimelist.net/images/characters/10/72535.jpg'
    }
  },
  'demonslayer': {
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    banner: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Tanjiro Kamado': 'https://cdn.myanimelist.net/images/characters/9/383020.jpg',
      'Nezuko Kamado': 'https://cdn.myanimelist.net/images/characters/3/383022.jpg',
      'Zenitsu Agatsuma': 'https://cdn.myanimelist.net/images/characters/12/383024.jpg'
    }
  },
  'deathnote': {
    image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Light Yagami (Kira)': 'https://cdn.myanimelist.net/images/characters/6/63870.jpg',
      'L Lawliet': 'https://cdn.myanimelist.net/images/characters/10/57814.jpg',
      'Ryuk': 'https://cdn.myanimelist.net/images/characters/14/73177.jpg'
    }
  },
  'steinsgate': {
    image: 'https://cdn.myanimelist.net/images/anime/1935/127974.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Rintaro Okabe': 'https://cdn.myanimelist.net/images/characters/6/123307.jpg',
      'Kurisu Makise': 'https://cdn.myanimelist.net/images/characters/5/123309.jpg',
      'Mayuri Shiina': 'https://cdn.myanimelist.net/images/characters/11/123311.jpg'
    }
  },
  'chainsawman': {
    image: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Denji': 'https://cdn.myanimelist.net/images/characters/3/491564.jpg',
      'Makima': 'https://cdn.myanimelist.net/images/characters/9/491566.jpg',
      'Power': 'https://cdn.myanimelist.net/images/characters/7/491565.jpg'
    }
  },
  'vinlandsaga': {
    image: 'https://cdn.myanimelist.net/images/anime/1500/103005.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Thorfinn': 'https://cdn.myanimelist.net/images/characters/13/387405.jpg',
      'Askeladd': 'https://cdn.myanimelist.net/images/characters/15/387406.jpg'
    }
  },
  'mobpsycho': {
    image: 'https://cdn.myanimelist.net/images/anime/1918/96303.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Shigeo Kageyama (Mob)': 'https://cdn.myanimelist.net/images/characters/8/313677.jpg',
      'Arataka Reigen': 'https://cdn.myanimelist.net/images/characters/16/313676.jpg'
    }
  },
  'sololeveling': {
    image: 'https://cdn.myanimelist.net/images/anime/1586/143534.jpg',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Sung Jin-Woo': 'https://cdn.myanimelist.net/images/characters/15/534123.jpg',
      'Cha Hae-In': 'https://cdn.myanimelist.net/images/characters/8/534124.jpg'
    }
  },

  // Manga
  'berserk': {
    image: 'https://cdn.myanimelist.net/images/manga/1/157897.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Guts': 'https://cdn.myanimelist.net/images/characters/15/309174.jpg',
      'Griffith': 'https://cdn.myanimelist.net/images/characters/4/74381.jpg',
      'Casca': 'https://cdn.myanimelist.net/images/characters/3/74382.jpg'
    }
  },
  'vagabond': {
    image: 'https://cdn.myanimelist.net/images/manga/1/259070.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Miyamoto Musashi (Takezo)': 'https://cdn.myanimelist.net/images/characters/15/34726.jpg',
      'Sasaki Kojiro': 'https://cdn.myanimelist.net/images/characters/2/34727.jpg'
    }
  },
  'monster': {
    image: 'https://cdn.myanimelist.net/images/manga/3/54525.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Dr. Kenzo Tenma': 'https://cdn.myanimelist.net/images/characters/16/32733.jpg',
      'Johan Liebert': 'https://cdn.myanimelist.net/images/characters/12/32735.jpg'
    }
  },
  '20thcb': {
    image: 'https://cdn.myanimelist.net/images/manga/2/253457.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Kenji Endo': 'https://cdn.myanimelist.net/images/characters/11/32738.jpg',
      'Friend': 'https://cdn.myanimelist.net/images/characters/7/32739.jpg'
    }
  },
  'kingdom': {
    image: 'https://cdn.myanimelist.net/images/manga/2/171872.jpg',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Xin (Li Xin)': 'https://cdn.myanimelist.net/images/characters/7/172373.jpg',
      'Ying Zheng': 'https://cdn.myanimelist.net/images/characters/8/172375.jpg'
    }
  },
  'punpun': {
    image: 'https://cdn.myanimelist.net/images/manga/3/164420.jpg',
    banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Punpun Onodera': 'https://cdn.myanimelist.net/images/characters/11/74384.jpg',
      'Aiko Tanaka': 'https://cdn.myanimelist.net/images/characters/16/74385.jpg'
    }
  },
  'slamdunk': {
    image: 'https://cdn.myanimelist.net/images/manga/2/258749.jpg',
    banner: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Hanamichi Sakuragi': 'https://cdn.myanimelist.net/images/characters/9/74386.jpg',
      'Kaede Rukawa': 'https://cdn.myanimelist.net/images/characters/13/74387.jpg'
    }
  },
  'tokyoghoul': {
    image: 'https://cdn.myanimelist.net/images/manga/3/116963.jpg',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Ken Kaneki': 'https://cdn.myanimelist.net/images/characters/12/260741.jpg',
      'Touka Kirishima': 'https://cdn.myanimelist.net/images/characters/14/260743.jpg'
    }
  },

  // Manhwa
  'orv': {
    image: 'https://cdn.myanimelist.net/images/manga/2/236147.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Kim Dokja': 'https://cdn.myanimelist.net/images/characters/14/436594.jpg',
      'Yoo Joonghyuk': 'https://cdn.myanimelist.net/images/characters/15/436595.jpg',
      'Han Sooyoung': 'https://cdn.myanimelist.net/images/characters/6/436596.jpg'
    }
  },
  'tog': {
    image: 'https://cdn.myanimelist.net/images/manga/1/260062.jpg',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Twenty-Fifth Bam': 'https://cdn.myanimelist.net/images/characters/16/407981.jpg',
      'Khun Aguero Agnes': 'https://cdn.myanimelist.net/images/characters/14/407982.jpg',
      'Rak Wraithraiser': 'https://cdn.myanimelist.net/images/characters/7/407983.jpg'
    }
  },
  'tbate': {
    image: 'https://cdn.myanimelist.net/images/manga/3/232049.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Arthur Leywin': 'https://cdn.myanimelist.net/images/characters/11/436597.jpg',
      'Sylvie': 'https://cdn.myanimelist.net/images/characters/8/436598.jpg'
    }
  },
  'windbreaker': {
    image: 'https://cdn.myanimelist.net/images/manga/1/223788.jpg',
    banner: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Jay Jo': 'https://cdn.myanimelist.net/images/characters/2/436599.jpg',
      'Minu Yoon': 'https://cdn.myanimelist.net/images/characters/4/436600.jpg'
    }
  },
  'lookism': {
    image: 'https://cdn.myanimelist.net/images/manga/1/170366.jpg',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Daniel Park (Park Hyung-suk)': 'https://cdn.myanimelist.net/images/characters/6/492578.jpg',
      'Vasco (Lee Eun-tae)': 'https://cdn.myanimelist.net/images/characters/15/492579.jpg'
    }
  },
  'eleceed': {
    image: 'https://cdn.myanimelist.net/images/manga/1/237669.jpg',
    banner: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Jiwoo Seo': 'https://cdn.myanimelist.net/images/characters/5/436601.jpg',
      'Kayden Break': 'https://cdn.myanimelist.net/images/characters/12/436602.jpg'
    }
  },
  'mounthua': {
    image: 'https://cdn.myanimelist.net/images/manga/1/256728.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Chung Myung': 'https://cdn.myanimelist.net/images/characters/3/466548.jpg',
      'Baek Cheon': 'https://cdn.myanimelist.net/images/characters/7/466549.jpg'
    }
  },
  'nanomachine': {
    image: 'https://cdn.myanimelist.net/images/manga/3/250956.jpg',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Cheon Yeo-woon': 'https://cdn.myanimelist.net/images/characters/16/447683.jpg'
    }
  },
  'estatedev': {
    image: 'https://cdn.myanimelist.net/images/manga/2/266782.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Lloyd Frontera (Suho Kim)': 'https://cdn.myanimelist.net/images/characters/10/494191.jpg',
      'Javier Asrahan': 'https://cdn.myanimelist.net/images/characters/9/494192.jpg'
    }
  },
  'suicidehunter': {
    image: 'https://cdn.myanimelist.net/images/manga/3/247854.jpg',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Kim Gong-ja': 'https://cdn.myanimelist.net/images/characters/13/447684.jpg'
    }
  },
  'northernblade': {
    image: 'https://cdn.myanimelist.net/images/manga/3/239794.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Jin Mu-won': 'https://cdn.myanimelist.net/images/characters/14/436603.jpg'
    }
  },
  'bastard': {
    image: 'https://cdn.myanimelist.net/images/manga/1/172233.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Seon Woo': 'https://cdn.myanimelist.net/images/characters/4/316982.jpg',
      'Dongsoo Seon': 'https://cdn.myanimelist.net/images/characters/6/316983.jpg'
    }
  },
  'sweethome': {
    image: 'https://cdn.myanimelist.net/images/manga/3/218844.jpg',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Cha Hyun-soo': 'https://cdn.myanimelist.net/images/characters/15/397852.jpg'
    }
  },
  'weakhero': {
    image: 'https://cdn.myanimelist.net/images/manga/2/236053.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Gray Yeon': 'https://cdn.myanimelist.net/images/characters/7/436604.jpg',
      'Ben Park': 'https://cdn.myanimelist.net/images/characters/11/436605.jpg'
    }
  },
  'viralhit': {
    image: 'https://cdn.myanimelist.net/images/manga/2/236894.jpg',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Hobin Yoo': 'https://cdn.myanimelist.net/images/characters/3/540445.jpg',
      'Snapper (Woo Jisuk)': 'https://cdn.myanimelist.net/images/characters/8/540446.jpg'
    }
  },

  // Donghua
  'wushan': {
    image: 'https://cdn.myanimelist.net/images/anime/1123/108520.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Wen Ren Jing Xuan (Fire Duck)': 'https://cdn.myanimelist.net/images/characters/12/419812.jpg',
      'Shen Tu Zi Ke (Water)': 'https://cdn.myanimelist.net/images/characters/14/419813.jpg'
    }
  },
  'linkclick': {
    image: 'https://cdn.myanimelist.net/images/anime/1416/114997.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Cheng Xiaoshi': 'https://cdn.myanimelist.net/images/characters/7/440597.jpg',
      'Lu Guang': 'https://cdn.myanimelist.net/images/characters/13/440598.jpg',
      'Qiao Ling': 'https://cdn.myanimelist.net/images/characters/2/440599.jpg'
    }
  },
  'tgcf': {
    image: 'https://cdn.myanimelist.net/images/anime/1148/109033.jpg',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Xie Lian': 'https://cdn.myanimelist.net/images/characters/5/422329.jpg',
      'Hua Cheng (San Lang)': 'https://cdn.myanimelist.net/images/characters/9/422330.jpg'
    }
  },
  'mdzs': {
    image: 'https://cdn.myanimelist.net/images/anime/1267/97801.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Wei Wuxian (Yiling Patriarch)': 'https://cdn.myanimelist.net/images/characters/2/361099.jpg',
      'Lan Wangji (Hanguang-Jun)': 'https://cdn.myanimelist.net/images/characters/10/361100.jpg'
    }
  },
  'kingsavatar': {
    image: 'https://cdn.myanimelist.net/images/anime/1987/92484.jpg',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Ye Xiu (Lord Grim)': 'https://cdn.myanimelist.net/images/characters/16/327771.jpg',
      'Su Mucheng (Dancing Rain)': 'https://cdn.myanimelist.net/images/characters/8/327772.jpg'
    }
  },
  'soulland': {
    image: 'https://cdn.myanimelist.net/images/anime/1344/94833.jpg',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Tang San': 'https://cdn.myanimelist.net/images/characters/6/351654.jpg',
      'Xiao Wu': 'https://cdn.myanimelist.net/images/characters/11/351655.jpg'
    }
  },
  'btth': {
    image: 'https://cdn.myanimelist.net/images/anime/1769/94848.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Xiao Yan': 'https://cdn.myanimelist.net/images/characters/14/351656.jpg',
      'Yao Lao': 'https://cdn.myanimelist.net/images/characters/12/351657.jpg'
    }
  },
  'awilleternal': {
    image: 'https://cdn.myanimelist.net/images/anime/1582/108849.jpg',
    banner: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Bai Xiaochun': 'https://cdn.myanimelist.net/images/characters/15/419814.jpg',
      'Du Lingfei': 'https://cdn.myanimelist.net/images/characters/3/419815.jpg'
    }
  },

  // Manhua
  'talesdemons': {
    image: 'https://cdn.myanimelist.net/images/manga/3/177926.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Nie Li': 'https://cdn.myanimelist.net/images/characters/15/309176.jpg',
      'Ye Ziyun': 'https://cdn.myanimelist.net/images/characters/7/309177.jpg',
      'Xiao Ning\'er': 'https://cdn.myanimelist.net/images/characters/12/309178.jpg'
    }
  },
  'martialpeak': {
    image: 'https://cdn.myanimelist.net/images/manga/2/235794.jpg',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Yang Kai': 'https://cdn.myanimelist.net/images/characters/6/436606.jpg',
      'Su Yan': 'https://cdn.myanimelist.net/images/characters/9/436607.jpg'
    }
  },
  'apotheosis': {
    image: 'https://cdn.myanimelist.net/images/manga/3/217997.jpg',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Luo Zheng': 'https://cdn.myanimelist.net/images/characters/16/394121.jpg'
    }
  },
  'nanhao': {
    image: 'https://cdn.myanimelist.net/images/manga/3/240212.jpg',
    banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Nan Hao': 'https://cdn.myanimelist.net/images/characters/13/440600.jpg',
      'Shang Feng': 'https://cdn.myanimelist.net/images/characters/11/440601.jpg'
    }
  },
  'ravages': {
    image: 'https://cdn.myanimelist.net/images/manga/1/157922.jpg',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    characters: {
      'Liaoyuan Huo (Zhao Yun)': 'https://cdn.myanimelist.net/images/characters/5/74389.jpg',
      'Sima Yi': 'https://cdn.myanimelist.net/images/characters/8/74390.jpg'
    }
  }
};

// Generic anime character pool for auto-assigning when specific character isn't explicitly mapped
const ANIME_CHARACTER_AVATAR_POOL = [
  'https://cdn.myanimelist.net/images/characters/11/256747.jpg',
  'https://cdn.myanimelist.net/images/characters/6/524317.jpg',
  'https://cdn.myanimelist.net/images/characters/4/491560.jpg',
  'https://cdn.myanimelist.net/images/characters/2/469446.jpg',
  'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
  'https://cdn.myanimelist.net/images/characters/9/383020.jpg',
  'https://cdn.myanimelist.net/images/characters/15/534123.jpg',
  'https://cdn.myanimelist.net/images/characters/10/216895.jpg',
  'https://cdn.myanimelist.net/images/characters/9/72533.jpg',
  'https://cdn.myanimelist.net/images/characters/6/123307.jpg',
  'https://cdn.myanimelist.net/images/characters/15/309174.jpg',
  'https://cdn.myanimelist.net/images/characters/14/436594.jpg',
  'https://cdn.myanimelist.net/images/characters/16/407981.jpg',
  'https://cdn.myanimelist.net/images/characters/2/436599.jpg',
  'https://cdn.myanimelist.net/images/characters/6/492578.jpg',
  'https://cdn.myanimelist.net/images/characters/7/440597.jpg',
  'https://cdn.myanimelist.net/images/characters/5/422329.jpg',
  'https://cdn.myanimelist.net/images/characters/16/327771.jpg',
  'https://cdn.myanimelist.net/images/characters/15/309176.jpg',
  'https://cdn.myanimelist.net/images/characters/12/260741.jpg'
];

function getCharacterAvatar(name, index) {
  for (const group of Object.values(EXACT_TITLE_IMAGES)) {
    if (group.characters && group.characters[name]) {
      return group.characters[name];
    }
  }
  return ANIME_CHARACTER_AVATAR_POOL[(index || 0) % ANIME_CHARACTER_AVATAR_POOL.length];
}

// 2. Update server/data/contentData.ts and server/data/moreContentData.ts
function updateContentFiles() {
  const contentDataPath = path.join(__dirname, '..', 'server', 'data', 'contentData.ts');
  const moreContentDataPath = path.join(__dirname, '..', 'server', 'data', 'moreContentData.ts');

  [contentDataPath, moreContentDataPath].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace known content ID patterns
    for (const [key, data] of Object.entries(EXACT_TITLE_IMAGES)) {
      // Replace character images
      if (data.characters) {
        for (const [charName, charImg] of Object.entries(data.characters)) {
          const charRegex = new RegExp(`name:\\s*['"]${charName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"],\\s*role:\\s*['"][^'"]+['"],\\s*image:\\s*['"][^'"]+['"]`, 'g');
          content = content.replace(charRegex, (match) => {
            return match.replace(/image:\s*['"][^'"]+['"]/, `image: '${charImg}'`);
          });
        }
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${path.basename(filePath)}`);
  });
}

// 3. Update scripts/generate_1000_collection.cjs with rich Anime/Manga/Manhwa/Donghua/Manhua cover pools
function updateCollectionGenerator() {
  const generatorPath = path.join(__dirname, 'generate_1000_collection.cjs');
  if (!fs.existsSync(generatorPath)) return;

  let genContent = fs.readFileSync(generatorPath, 'utf8');

  // Replace image arrays with curated real anime/manga/manhwa/donghua/manhua artwork
  const NEW_MANGA_IMAGES = `const MANGA_IMAGES = [
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
];`;

  const NEW_MANHWA_IMAGES = `const MANHWA_IMAGES = [
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
];`;

  const NEW_MANHUA_IMAGES = `const MANHUA_IMAGES = [
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
];`;

  const NEW_DONGHUA_IMAGES = `const DONGHUA_IMAGES = [
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
];`;

  // Replace using regex
  genContent = genContent.replace(/const MANGA_IMAGES = \[[\s\S]*?\];/, NEW_MANGA_IMAGES);
  genContent = genContent.replace(/const MANHWA_IMAGES = \[[\s\S]*?\];/, NEW_MANHWA_IMAGES);
  genContent = genContent.replace(/const MANHUA_IMAGES = \[[\s\S]*?\];/, NEW_MANHUA_IMAGES);
  genContent = genContent.replace(/const DONGHUA_IMAGES = \[[\s\S]*?\];/, NEW_DONGHUA_IMAGES);

  fs.writeFileSync(generatorPath, genContent, 'utf8');
  console.log('✅ Updated scripts/generate_1000_collection.cjs');
}

// 4. Update src/pages/ProfilePage.tsx with anime avatar choices
function updateProfileAvatars() {
  const profilePath = path.join(__dirname, '..', 'src', 'pages', 'ProfilePage.tsx');
  if (!fs.existsSync(profilePath)) return;

  let content = fs.readFileSync(profilePath, 'utf8');
  const NEW_AVATARS = `const AVATARS = [
  'https://cdn.myanimelist.net/images/characters/2/469446.jpg', // Anya
  'https://cdn.myanimelist.net/images/characters/15/422168.jpg', // Gojo
  'https://cdn.myanimelist.net/images/characters/3/383022.jpg', // Nezuko
  'https://cdn.myanimelist.net/images/characters/15/534123.jpg', // Sung Jin-Woo
  'https://cdn.myanimelist.net/images/characters/6/524317.jpg', // Frieren
  'https://cdn.myanimelist.net/images/characters/4/491560.jpg', // Bocchi
];`;

  content = content.replace(/const AVATARS = \[[\s\S]*?\];/, NEW_AVATARS);
  fs.writeFileSync(profilePath, content, 'utf8');
  console.log('✅ Updated ProfilePage avatars with anime characters');
}

// 5. Update src/pages/HomePage.tsx cross-media preview cards
function updateHomePagePreview() {
  const homePath = path.join(__dirname, '..', 'src', 'pages', 'HomePage.tsx');
  if (!fs.existsSync(homePath)) return;

  let content = fs.readFileSync(homePath, 'utf8');
  content = content.replace(
    'src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80"',
    'src="https://cdn.myanimelist.net/images/anime/1586/143534.jpg"'
  );
  content = content.replace(
    'src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80"',
    'src="https://cdn.myanimelist.net/images/manga/3/222295.jpg"'
  );
  content = content.replace(
    'src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80"',
    'src="https://cdn.myanimelist.net/images/anime/1416/114997.jpg"'
  );

  fs.writeFileSync(homePath, content, 'utf8');
  console.log('✅ Updated HomePage preview cards with real anime/manga/manhwa art');
}

// Execute all updates
updateContentFiles();
updateCollectionGenerator();
updateProfileAvatars();
updateHomePagePreview();

console.log('🎉 Update script written and completed successfully!');
