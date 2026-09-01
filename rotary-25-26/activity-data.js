(() => {
  const DEFAULT_LANGUAGE = "zh-TW";
  const SUPPORTED_LANGUAGES = Object.freeze(["zh-TW", "en"]);

  const STATUS_LABELS = Object.freeze({
    photo: localized("活動相片", "Photos"),
    document: localized("手冊頁面", "Handbook page"),
    placeholder: localized("待補照片", "Coming soon"),
  });

  const FILTER_DEFINITIONS = Object.freeze([
    { id: "all", label: localized("活動類別", "Event categories") },
    { id: "service", label: localized("公益例會", "Service") },
    { id: "governance", label: localized("會務例會", "Club affairs") },
    { id: "fellowship", label: localized("聯誼例會", "Fellowship") },
    { id: "vocational", label: localized("職業例會", "Vocational") },
    { id: "sports", label: localized("運動例會", "Sports") },
  ]);

  const EVENT_CATEGORIES = Object.freeze({
    "2025-06": ["governance"],
    "2025-07": ["governance", "fellowship"],
    "2025-08": ["governance"],
    "2025-09": ["fellowship", "vocational"],
    "2025-10": ["sports"],
    "2025-11-textile": ["vocational"],
    "2025-11-blood": ["service"],
    "2025-11-blockchain": ["vocational"],
    "2025-12": ["service"],
    "2026-01": ["governance"],
    "2026-02": ["governance", "fellowship"],
    "2026-03": ["governance", "fellowship"],
    "2026-04": ["service", "sports"],
    "2026-05": ["vocational"],
    "2026-06": ["governance"],
  });

  function localized(zhTw, en) {
    return Object.freeze({
      "zh-TW": zhTw,
      en,
    });
  }

  function padNumber(value) {
    return String(value).padStart(2, "0");
  }

  function formatEventLabel(year, month) {
    return `${year}.${padNumber(month)}`;
  }

  function createImageAsset(src, alt, options = {}) {
    return {
      kind: "image",
      src,
      alt,
      ...options,
    };
  }

  function createVideoAsset(src, alt, options = {}) {
    return {
      kind: "video",
      src,
      alt,
      ...options,
    };
  }

  function createLocalizedLink(zhTwLabel, enLabel, url, options = {}) {
    return {
      label: localized(zhTwLabel, enLabel),
      url,
      ...options,
    };
  }

  function localizedList(...entries) {
    return entries.map(([zhTw, en]) => localized(zhTw, en));
  }

  function galleryImage(src, zhTwAlt, enAlt, zhTwCaption, enCaption, options = {}) {
    return createImageAsset(src, localized(zhTwAlt, enAlt), {
      ...(zhTwCaption || enCaption ? { caption: localized(zhTwCaption, enCaption) } : {}),
      ...options,
    });
  }

  function galleryVideo(src, poster, zhTwAlt, enAlt, zhTwCaption, enCaption, options = {}) {
    return createVideoAsset(src, localized(zhTwAlt, enAlt), {
      poster,
      ...(zhTwCaption || enCaption ? { caption: localized(zhTwCaption, enCaption) } : {}),
      ...options,
    });
  }

  function reportGallery(prefix, count, zhTwAlt, enAlt, zhTwCaption, enCaption) {
    return Array.from({ length: count }, (_, index) => {
      const photoNumber = index + 1;

      return galleryImage(
        `assets/photos/${prefix}-${padNumber(photoNumber)}.jpg`,
        `${zhTwAlt} ${photoNumber}`,
        `${enAlt} ${photoNumber}`,
        zhTwCaption,
        enCaption,
      );
    });
  }

  function createEvent(config) {
    return {
      highlights: [],
      links: [],
      activityBlocks: [],
      ...config,
    };
  }

  function createPhotoEvent({ coverSrc, coverAlt, gallery, ...event }) {
    return createEvent({
      ...event,
      visualMode: "photo",
      cover: createImageAsset(coverSrc, coverAlt),
      gallery,
    });
  }

  function isLocalizedValue(value) {
    if (!value || Array.isArray(value) || typeof value !== "object") {
      return false;
    }

    const keys = Object.keys(value);

    return (
      keys.length === SUPPORTED_LANGUAGES.length &&
      SUPPORTED_LANGUAGES.every((language) => language in value) &&
      keys.every((key) => SUPPORTED_LANGUAGES.includes(key))
    );
  }

  function resolveLocalizedValue(value, language) {
    if (isLocalizedValue(value)) {
      return value[language] ?? value[DEFAULT_LANGUAGE];
    }

    if (Array.isArray(value)) {
      return value.map((item) => resolveLocalizedValue(item, language));
    }

    if (value && typeof value === "object") {
      return Object.entries(value).reduce((result, [key, entryValue]) => {
        result[key] = resolveLocalizedValue(entryValue, language);
        return result;
      }, {});
    }

    return value;
  }

  function createFrameCountLabel(count, language) {
    return language === "en" ? `${count} photos` : `${count} 張照片`;
  }

  function normalizeEvent(rawEvent, language) {
    const event = resolveLocalizedValue(rawEvent, language);
    const label = formatEventLabel(event.year, event.month);
    const statusLabel = resolveLocalizedValue(STATUS_LABELS[event.visualMode], language);
    const dateLabel = event.date || label;

    return {
      ...event,
      categories: EVENT_CATEGORIES[event.id] || [],
      label,
      dateLabel,
      statusLabel,
      frameCountLabel: event.frameCountLabel || createFrameCountLabel(event.gallery.length, language),
      detailKicker: `${label}｜${dateLabel}`,
      materialStatus: event.availability,
    };
  }

  const activityEvents = [
    createPhotoEvent({
      id: "2025-06",
      year: 2025,
      month: 6,
      order: 1,
      title: localized("北區與新北區聯合交接典禮・九份畢旅", "Joint Handover Ceremony & Jiufen Trip"),
      subtitle: localized("年度從交接典禮與九份畢旅揭開序幕。", "The year opens with the handover ceremony and the Jiufen trip."),
      folder: localized("6月活動＿交接典禮＆九份畢旅", "June Activities — Handover Ceremony & Jiufen Trip"),
      date: localized("2025/6/28 聯合交接典禮・2025/6/28-29 九份畢旅", "2025/6/28 Joint Handover Ceremony · 2025/6/28-29 Jiufen Trip"),
      location: localized("交接典禮 / 九份", "Handover Ceremony / Jiufen"),
      accent: "#b06f4a",
      coverSrc: "assets/photos/june-handover-handbook-cover.jpg",
      coverAlt: localized("6月交接典禮手冊人物合照", "June handbook portrait from the handover ceremony"),
      summary: localized(
        "新年度從交接典禮與旅行開始。婉華與詠文接下北區、新北區的責任後，和夥伴們一同前往九份進行兩天一夜的旅程。大家走進老街、品嚐在地美食，也在茶樓裡喝茶聊天，在不同於正式例會的輕鬆氣氛中拉近彼此距離。這趟旅行既是上一年度的紀念，也是新團隊第一次一起出發。",
        "The new Rotary year began with a handover and a trip. After Hannah and Victoria took on their roles in Taipei North and New Taipei, the group set out for two days in Jiufen. They walked the old streets, shared local food, and talked over tea in a setting far removed from a formal meeting. The trip marked both a farewell to the previous year and the new team's first journey together.",
      ),
      highlights: localizedList(
        ["年度交接", "Handover"],
        ["九份畢旅", "Jiufen trip"],
        ["兩位會長", "Both presidents"],
        ["年度起點", "Opening chapter"],
      ),
      availability: localized(
        "這個月份收錄交接典禮、九份畢旅的行程與合照。",
        "The handover and trip sit together in this opening month, leaving the first group photos and first shared itinerary of the year.",
      ),
      gallery: [
        galleryImage(
          "assets/photos/june-handover-handbook-cover.jpg",
          "交接典禮手冊人物合照",
          "Portrait from the handover handbook",
          "交接典禮人物合照。",
          "Portrait from the handover ceremony handbook.",
        ),
        ...reportGallery(
          "annual-2025-06",
          5,
          "聯合交接典禮與九份畢旅活動紀錄",
          "Joint handover and Jiufen trip photo",
          "聯合交接典禮與九份畢旅。",
          "Joint handover ceremony and Jiufen trip.",
        ),
        galleryImage(
          "assets/photos/june-handover-handbook-page-web.jpg",
          "交接典禮手冊月份頁",
          "June page from the handover handbook",
          "6 月手冊頁。",
          "June handbook spread.",
        ),
        galleryImage(
          "assets/photos/june-jiufen-handbook-group.jpg",
          "九份畢旅手冊團體畫面",
          "Jiufen trip group photo from the handbook",
          "九份畢旅團體畫面。",
          "Group photo from the Jiufen trip.",
        ),
      ],
    }),
    createPhotoEvent({
      id: "2025-07",
      year: 2025,
      month: 7,
      order: 2,
      title: localized("北區新北區聯合幹部訓練", "Joint Leadership Training"),
      subtitle: localized(
        "在宜蘭進行兩天一夜的聯合幹部訓練，並安排 Day 1 與晴雨版 Day 2 行程。",
        "A two-day joint leadership training in Yilan, with a first-day program and sunny or rainy options for day two.",
      ),
      folder: localized("7月活動＿幹部訓練", "July Activities — Leadership Training"),
      date: "2025/7/19-20",
      location: localized("宜蘭", "Yilan"),
      accent: "#766247",
      coverSrc: "assets/photos/july-training-handbook-cover.jpg",
      coverAlt: localized("7月幹部訓練正式合影", "Formal group photo from the July leadership training"),
      summary: localized(
        "為了迎接接下來一整年的活動，雙北幹部來到宜蘭進行兩天一夜的幹部訓練。除了透過例會進一步了解聯誼會運作，行程也安排分組戲水、唱歌、烤肉與交流活動。從白天的團隊合作一路聊到晚上，大家在相處中逐漸找到默契，也從一群剛開始合作的夥伴，慢慢成為能夠一起規劃、一起執行活動的團隊。",
        "To prepare for the year ahead, the Taipei North and New Taipei teams spent two days training together in Yilan. Formal sessions introduced the fellowship's work, while water games, singing, a barbecue, and evening conversations gave everyone time to learn how to work together. By the end of the trip, a newly formed committee had begun to feel like a team ready to plan and run the year's activities.",
      ),
      highlights: localizedList(
        ["幹部訓練", "Leadership training"],
        ["宜蘭", "Yilan"],
        ["兩天一夜", "Overnight"],
        ["晴雨版本", "Sunny and rainy plans"],
        ["年度默契", "Team chemistry"],
      ),
      frameCountLabel: localized("8 筆內容", "8 items"),
      availability: localized(
        "已整理 Day 1 室內版、Day 2 晴天版與雨天版行程，也補上現場照片與短片。",
        "Day 1, Day 2 sunny, and Day 2 rainy itineraries are now organized here alongside photos and short videos from the training.",
      ),
      activityBlocks: [
        {
          date: localized("Day 1｜2025/7/19", "Day 1 · 2025/7/19"),
          title: localized("Day 1 室內版", "Day 1 · Indoor Program"),
          summary: localized(
            "上午各車陸續出發，中午先在羅東用餐，午後於芯園茶屋進行例會與下午茶，接著換裝參加分組戲水競賽；晚上一起唱歌、烤肉與交流。",
            "Cars departed through the morning, lunch followed in Luodong, and the afternoon moved into the formal session at Xinyuan Tea House, afternoon tea, and team water games. The evening closed with singing, barbecue, and time together.",
          ),
          details: localizedList(
            ["09:00–10:00｜各車出發", "09:00–10:00 · Departures by car"],
            ["11:00–12:30｜基隆甕仔雞羅東分店午餐", "11:00–12:30 · Lunch at Keelung Wengzai Chicken, Luodong branch"],
            ["13:00–14:00｜芯園茶屋例會", "13:00–14:00 · Formal session at Xinyuan Tea House"],
            ["14:00–14:30｜民宿下午茶時光", "14:00–14:30 · Afternoon tea at the inn"],
            ["14:30–17:00｜更衣、分組戲水競賽", "14:30–17:00 · Change clothes and team water games"],
            ["17:30 起｜唱歌、烤肉、觀星與晚間交流", "From 17:30 · Singing, barbecue, stargazing, and evening bonding"],
          ),
          tags: localizedList(
            ["例會", "Meeting"],
            ["戲水競賽", "Water games"],
            ["晚間交流", "Evening bonding"],
          ),
          imageSrc: "assets/photos/july-training-day1-indoor-itinerary.jpg",
          imageAlt: localized("幹部訓練 Day 1 室內版行程整理圖", "Day 1 indoor itinerary board for the leadership training"),
          imageCaption: localized("Day 1 室內版行程整理。", "Day 1 indoor itinerary board."),
        },
        {
          date: localized("Day 2｜晴天版", "Day 2 · Sunny Version"),
          title: localized("Day 2 晴天版", "Day 2 · Sunny Plan"),
          summary: localized(
            "若天氣放晴，第二天會往南方澳海線移動：早餐後前往海灘與海鮮午餐，午後在海景咖啡廳或 CASA 海洋 1 館停留，傍晚再走南方澳大橋、豆腐岬與內埤海水浴場。",
            "If the weather clears, day two heads toward the South Bay coast: breakfast at the inn, the beach and seafood for lunch, then time at a sea-view cafe or CASA Ocean Hall 1 before an evening loop through Nanfang'ao Bridge, Tofu Cape, and Neipi Beach.",
          ),
          details: localizedList(
            ["09:00–12:00｜民宿早餐", "09:00–12:00 · Breakfast at the inn"],
            ["11:00–11:30｜出發南方澳海灘", "11:00–11:30 · Head toward Nanfang'ao Beach"],
            ["午餐｜海珍活海鮮餐廳（太飽可略）", "Lunch · Haizhen Live Seafood Restaurant (optional if everyone is too full)"],
            ["13:00–14:00｜喬伊吹吹風或 CASA 海洋 1 館", "13:00–14:00 · Qiaoyi Chui Chui Feng cafe or CASA Ocean Hall 1"],
            ["傍晚｜南方澳大橋、豆腐岬一坪海岸窗口碉堡、內埤海水浴場", "Evening · Nanfang'ao Bridge, the Tofu Cape coastal bunker window, and Neipi Beach"],
          ),
          tags: localizedList(
            ["晴天版", "Sunny plan"],
            ["南方澳", "Nanfang'ao"],
            ["海線", "Coastline"],
          ),
          imageSrc: "assets/photos/july-training-day2-sunny-itinerary.jpg",
          imageAlt: localized("幹部訓練 Day 2 晴天版行程整理圖", "Day 2 sunny itinerary board for the leadership training"),
          imageCaption: localized("Day 2 晴天版行程整理。", "Day 2 sunny itinerary board."),
        },
        {
          date: localized("Day 2｜雨天版", "Day 2 · Rainy Version"),
          title: localized("Day 2 雨天版", "Day 2 · Rainy Plan"),
          summary: localized(
            "若遇下雨，第二天則改走冬山河周邊：早餐後轉往火鍋店用餐，午後可在 Woosh Cafe × 半日森或宜蘭傳藝園區停留，晚上依天氣提早回臺北或續攤唱歌。",
            "If it rains, day two shifts to the Dongshan River area: hot pot for lunch, an afternoon stop at Woosh Cafe x Halfday or the Yilan Traditional Arts Center, and then an early return to Taipei or a final karaoke stop depending on the weather.",
          ),
          details: localizedList(
            ["09:00–12:00｜民宿早餐", "09:00–12:00 · Breakfast at the inn"],
            ["11:00–11:30｜出發冬山河地區", "11:00–11:30 · Head toward the Dongshan River area"],
            ["午餐｜宜蘭湯蒸火鍋店（太飽可略）", "Lunch · Yilan Tangzheng Hot Pot (optional if everyone is too full)"],
            ["13:00–14:00｜Woosh Cafe × 半日森或宜蘭傳藝園區", "13:00–14:00 · Woosh Cafe x Halfday or the Yilan Traditional Arts Center"],
            ["晚上｜提早回臺北，或回臺北 Sing go! 唱歌", "Evening · Return to Taipei early, or head to Sing Go for karaoke"],
            ["行程結束｜平安回家", "End of trip · Head home safely"],
          ),
          tags: localizedList(
            ["雨天版", "Rainy plan"],
            ["冬山河", "Dongshan River"],
            ["雨備行程", "Rain backup"],
          ),
          imageSrc: "assets/photos/july-training-day2-rain-itinerary.jpg",
          imageAlt: localized("幹部訓練 Day 2 雨天版行程整理圖", "Day 2 rainy itinerary board for the leadership training"),
          imageCaption: localized("Day 2 雨天版行程整理。", "Day 2 rainy itinerary board."),
        },
      ],
      gallery: [
        galleryImage(
          "assets/photos/july-training-handbook-cover.jpg",
          "幹部訓練正式合影",
          "Formal group photo from the leadership training",
          "幹部訓練正式合影。",
          "Formal group photo from the leadership training.",
        ),
        ...reportGallery(
          "annual-2025-07",
          5,
          "宜蘭幹部訓練活動紀錄",
          "Yilan leadership training photo",
          "宜蘭幹部訓練。",
          "Leadership training in Yilan.",
        ),
        galleryImage(
          "assets/photos/july-training-day1-indoor-itinerary.jpg",
          "幹部訓練 Day 1 室內版行程圖",
          "Day 1 indoor itinerary board",
          "Day 1 室內版行程海報。",
          "Day 1 indoor itinerary board.",
        ),
        galleryImage(
          "assets/photos/july-training-day2-sunny-itinerary.jpg",
          "幹部訓練 Day 2 晴天版行程圖",
          "Day 2 sunny itinerary board",
          "Day 2 晴天版行程海報。",
          "Day 2 sunny itinerary board.",
        ),
        galleryImage(
          "assets/photos/july-training-day2-rain-itinerary.jpg",
          "幹部訓練 Day 2 雨天版行程圖",
          "Day 2 rainy itinerary board",
          "Day 2 雨天版行程海報。",
          "Day 2 rainy itinerary board.",
        ),
        galleryVideo(
          "assets/videos/july-training-reel-01.mp4",
          "assets/photos/july-training-handbook-cover.jpg",
          "幹部訓練活動短片一",
          "Leadership training reel one",
          "幹部訓練活動短片。",
          "A short reel from the leadership training.",
        ),
        galleryVideo(
          "assets/videos/july-training-reel-02.mp4",
          "assets/photos/july-training-handbook-cover.jpg",
          "幹部訓練活動短片二",
          "Leadership training reel two",
          "幹部訓練活動短片。",
          "Another short reel from the leadership training.",
        ),
      ],
    }),
    createPhotoEvent({
      id: "2025-08",
      year: 2025,
      month: 8,
      order: 3,
      title: localized("五區交接暨菁英論壇", "Five-District Handover & Leadership Forum"),
      subtitle: localized("五區交接與菁英論壇於同一天舉行。", "The handover and leadership forum took place on the same day."),
      folder: localized("8月五區聯合交接暨菁英論壇", "August Activities — Five-District Handover & Leadership Forum"),
      date: "2025/8/16",
      location: localized("五區聯合活動", "Five-district joint event"),
      accent: "#36547a",
      coverSrc: "assets/photos/aug-forum-meeting-photo.jpg",
      coverAlt: localized("五區交接暨菁英論壇現場會議畫面", "Forum meeting scene from the five-district handover"),
      summary: localized(
        "五區夥伴齊聚一堂，正式迎來新年度的聯合交接，北區會長婉華與新北區會長詠文也在這一天正式接棒。除了象徵責任與服務精神的傳承，活動也安排菁英論壇，透過不同領域前輩的經驗分享，讓獎學生看見更多職涯與人生的可能。從受獎到服務、從學習到承擔，希望每一位夥伴都能帶著在扶輪獲得的養分，在自己的道路上持續成長。",
        "Members from five districts gathered for the new year's joint handover, where Hannah of Taipei North and Victoria of New Taipei formally began their terms. The ceremony passed on both responsibility and a commitment to service. A leadership forum followed, bringing together speakers from different fields and giving scholarship recipients a wider view of possible careers and lives beyond the program.",
      ),
      highlights: localizedList(
        ["五區聯合", "Five districts"],
        ["交接", "Handover"],
        ["菁英論壇", "Leadership forum"],
      ),
      availability: localized(
        "交接與論壇同場進行，留下的是上任時刻與現場交流。",
        "The handover and forum share the same stage, pairing the new term with live exchange across the room.",
      ),
      gallery: [
        galleryImage(
          "assets/photos/aug-forum-meeting-photo.jpg",
          "五區交接暨菁英論壇現場會議畫面",
          "Meeting scene from the five-district handover forum",
          "論壇現場畫面。",
          "Forum meeting scene.",
        ),
        galleryImage(
          "assets/photos/aug-forum-group-handbook.jpg",
          "五區交接暨菁英論壇手冊擷取團體畫面",
          "Group image from the five-district handover handbook",
          "手冊團體畫面。",
          "Group image from the handbook.",
        ),
        galleryImage(
          "assets/photos/aug-forum-handbook-page.jpg",
          "五區交接暨菁英論壇手冊月份頁",
          "August page from the five-district handover handbook",
          "8 月手冊頁。",
          "August handbook spread.",
        ),
      ],
    }),
    createPhotoEvent({
      id: "2025-09",
      year: 2025,
      month: 9,
      order: 4,
      title: localized("扶輪聲林之王", "Rotary Singing Night"),
      subtitle: localized(
        "把例會搬進 KTV，先比賽，也留時間自由歡唱。",
        "A meeting set inside a KTV, with time for both the contest and open singing.",
      ),
      folder: localized("9月活動__扶輪聲林之王", "September Activities — Rotary Singing Night"),
      date: "2025/9/20",
      location: localized("浪漫屋視聽歌唱城", "Romantic House KTV"),
      accent: "#69337a",
      coverSrc: "assets/photos/sep-singing-group-photo.jpg",
      coverAlt: localized("扶輪聲林之王現場主持與評審席畫面", "Scene from the Rotary Singing Night panel table"),
      summary: localized(
        "九月例會把舞台交給每一位喜歡唱歌、敢於展現自己的夥伴！活動來到充滿復古氣息的浪漫屋視聽歌唱城，舉辦趣味歌唱競賽，並邀請評審為參賽者講評。有人認真備戰、有人第一次鼓起勇氣站上舞台，也有人單純負責在台下用力歡呼。比賽結束後大家繼續自由歡唱、拍照交流，讓這場例會少了幾分正式，多了許多笑聲與共同回憶。",
        "September gave the stage to anyone who loved to sing or wanted to try performing. At the retro Romantic House KTV, members joined a lighthearted contest with feedback from the judges. Some arrived ready to compete, some stepped on stage for the first time, and others cheered from the audience. After the contest, the microphones stayed on for open singing, photos, and an easy afternoon together.",
      ),
      highlights: localizedList(
        ["歌唱比賽", "Singing contest"],
        ["專業評審", "Professional judges"],
        ["自由歡唱", "Open singing"],
        ["復古 KTV", "Retro KTV venue"],
      ),
      availability: localized(
        "從場佈、歌唱比賽到自由歡唱，完整收錄當天下午的活動。",
        "From setup to the contest and then open singing, the whole afternoon moves around the stage and the atmosphere in the room.",
      ),
      activityBlocks: [
        {
          date: localized("活動簡介", "Overview"),
          title: localized("這場例會怎麼玩", "How the meeting works"),
          summary: localized(
            "這次把例會放進復古舞廳改建的大坪數 KTV。想唱的人可以先報名，當天再決定要不要正式參賽；不比賽也沒關係，後面還有自由歡唱和拍照時間。",
            "This meeting moves into a large KTV converted from a vintage dance hall. Anyone interested can register first and decide on the day whether to enter the contest. Even if you do not compete, there is still open singing and photo time later in the afternoon.",
          ),
          details: localizedList(
            ["地點｜浪漫屋視聽歌唱城", "Venue · Romantic House KTV"],
            ["形式｜歌唱比賽＋自由歡唱", "Format · Singing contest plus open singing"],
            ["備註｜可先報名，再決定是否參賽", "Note · Register first, then decide whether to compete"],
          ),
          tags: localizedList(
            ["舞台例會", "Stage meeting"],
            ["自由歡唱", "Open singing"],
            ["拍照打卡", "Photo moments"],
          ),
          imageSrc: "assets/photos/sep-singing-group-photo.jpg",
          imageAlt: localized("扶輪聲林之王活動現場合照", "Group photo from Rotary Singing Night"),
          imageCaption: localized("扶輪聲林之王活動現場。", "Scene from Rotary Singing Night."),
        },
        {
          date: localized("當日流程", "Schedule"),
          title: localized("9 月 20 日流程", "September 20 schedule"),
          summary: localized(
            "中午先進場場佈與報到，下午進入正式比賽與評審點評，後段則留給自由歡唱與拍照。",
            "The day begins with setup and check-in at noon, moves into the contest and judge feedback in the afternoon, and ends with open singing and photo time.",
          ),
          details: localizedList(
            ["11:30–12:30｜場佈時間", "11:30–12:30 · Setup"],
            ["12:30–13:00｜報到與交流", "12:30–13:00 · Check-in and mingling"],
            ["13:00｜例會正式開始", "13:00 · Meeting begins"],
            ["13:00–15:00｜歌唱比賽與評審點評", "13:00–15:00 · Contest and judge feedback"],
            ["15:00–17:30｜自由歡唱、拍照打卡", "15:00–17:30 · Open singing and photo time"],
            ["17:30–18:00｜撤場", "17:30–18:00 · Wrap-up and load-out"],
          ),
          tags: localizedList(
            ["活動流程", "Schedule"],
            ["專業評審", "Professional judges"],
            ["自由歡唱", "Open singing"],
          ),
          imageSrc: "assets/photos/sep-singing-judges.jpg",
          imageAlt: localized("扶輪聲林之王評審席畫面", "Judges' table at Rotary Singing Night"),
          imageCaption: localized("例會中的評審席。", "The judges' table during the meeting."),
        },
      ],
      gallery: [
        galleryImage(
          "assets/photos/sep-singing-group-photo.jpg",
          "扶輪聲林之王現場主持與評審席畫面",
          "Scene from the Rotary Singing Night panel table",
          "扶輪聲林之王現場畫面。",
          "Rotary Singing Night scene.",
        ),
        ...reportGallery(
          "annual-2025-09",
          4,
          "扶輪聲林之王活動紀錄",
          "Rotary Singing Night photo",
          "扶輪聲林之王活動現場。",
          "Rotary Singing Night.",
        ),
        galleryImage(
          "assets/photos/sep-singing-stage-female.jpg",
          "扶輪聲林之王女參賽者舞台畫面",
          "Female performer on stage at Rotary Singing Night",
          "舞台演唱畫面。",
          "Performance on stage.",
        ),
        galleryImage(
          "assets/photos/sep-singing-stage-male.jpg",
          "扶輪聲林之王男參賽者舞台畫面",
          "Male performer on stage at Rotary Singing Night",
          "舞台演唱畫面。",
          "Performance on stage.",
        ),
        galleryImage(
          "assets/photos/sep-singing-award.jpg",
          "扶輪聲林之王頒獎畫面",
          "Award moment at Rotary Singing Night",
          "頒獎畫面。",
          "Award moment.",
        ),
        galleryImage(
          "assets/photos/sep-singing-judges.jpg",
          "扶輪聲林之王評審席畫面",
          "Judges' table at Rotary Singing Night",
          "評審席畫面。",
          "Judges' table.",
        ),
        galleryImage(
          "assets/photos/sep-singing-handbook-page.jpg",
          "扶輪聲林之王手冊月份頁",
          "September page from the Rotary Singing Night handbook",
          "9 月手冊頁。",
          "September handbook spread.",
        ),
      ],
      links: [
        createLocalizedLink("查看活動地點", "View venue", "https://maps.app.goo.gl/B4XaFm3LydVFTofH7"),
        createLocalizedLink("歌唱例會報名表單", "Singing meeting registration", "https://forms.gle/gbkruQiwpUwZXbnp6"),
      ],
    }),
    createPhotoEvent({
      id: "2025-10",
      year: 2025,
      month: 10,
      order: 5,
      title: localized("游泳例會", "Swimming Meeting"),
      subtitle: localized("咖啡廳集合後，再一起往泳池移動。", "The group gathers at a cafe before heading to the pool together."),
      folder: localized("10月活動_游泳例會", "October Activities — Swimming Meeting"),
      date: "2025/10/12",
      location: localized("Ramble Cafe ＆ 玉泉公園溫水游泳池", "Ramble Cafe and Yuquan Park Heated Pool"),
      accent: "#336987",
      coverSrc: "assets/photos/oct-swim-pool-scene-01.jpg",
      coverAlt: localized("游泳例會泳池活動畫面", "Swimming meeting pool scene"),
      summary: localized(
        "十月把知識與運動結合，先在 Ramble Cafe 集合交流，再一起前往玉泉公園溫水游泳池。透過健康與運動相關知識的分享，大家在下水前更了解暖身及避免運動傷害的重要性，接著直接把觀念帶到泳池實際體驗。從咖啡廳的交流到水中的運動時光，讓健康不只是聽完一場分享，而是真正融入生活的一次例會。",
        "October paired a short health session with time in the water. The group first met at Ramble Cafe, then moved together to Yuquan Park Heated Pool. Before swimming, members learned more about warm-ups and preventing sports injuries, then put those ideas into practice in the pool. The meeting carried the conversation about health from the cafe into an active afternoon.",
      ),
      highlights: localizedList(
        ["咖啡聯誼", "Cafe gathering"],
        ["泳池活動", "Pool session"],
        ["雙場地", "Two venues"],
      ),
      availability: localized(
        "兩個場地、當日流程和泳池資訊都整理在這裡。",
        "Both venues, the full schedule, and pool information are gathered here.",
      ),
      activityBlocks: [
        {
          date: localized("活動簡介", "Overview"),
          title: localized("先集合，再下水", "Gather first, then head to the pool"),
          summary: localized(
            "這場游泳例會分成咖啡廳與泳池兩個場地。前半段在北門附近集合、報到與分享，後半段再一起移動到玉泉公園溫水游泳池，讓整個下午的節奏比較從容。",
            "This swimming meeting is split across a cafe and a pool. The first half is for gathering, check-in, and sharing near Beimen, followed by a group move to Yuquan Park Heated Pool for the second half of the afternoon.",
          ),
          details: localizedList(
            ["日期｜2025 年 10 月 12 日（日）", "Date · Sunday, October 12, 2025"],
            ["第一場地｜Ramble Cafe 漫步藍咖啡－台北北門店", "Venue 1 · Ramble Cafe, Taipei Beimen Branch"],
            ["第二場地｜玉泉公園溫水游泳池", "Venue 2 · Yuquan Park Heated Pool"],
            ["提醒｜當天有兩個場地，請先確認集合地點", "Note · The activity uses two venues, so please check the meeting point before heading out"],
          ),
          tags: localizedList(
            ["雙場地", "Two venues"],
            ["10 月例會", "October meeting"],
            ["泳池活動", "Pool session"],
          ),
          imageSrc: "assets/photos/oct-swim-pool-scene-01.jpg",
          imageAlt: localized("游泳例會泳池活動畫面", "Swimming meeting pool scene"),
          imageCaption: localized("游泳例會泳池活動畫面。", "Pool scene from the swimming meeting."),
        },
        {
          date: localized("當日流程", "Schedule"),
          title: localized("10 月 12 日流程", "October 12 schedule"),
          summary: localized(
            "先在咖啡廳完成聯誼、報到與例會，再移動到泳池拍合照、下水活動，最後於傍晚結束。",
            "The afternoon begins with mingling, check-in, and the meeting at the cafe, then moves to the pool for a photo and swim before wrapping up in the evening.",
          ),
          details: localizedList(
            ["13:00–13:30｜Ramble Cafe 聯誼、報到", "13:00–13:30 · Mingling and check-in at Ramble Cafe"],
            ["13:30–14:30｜例會開始、講師分享、合照", "13:30–14:30 · Meeting begins, guest sharing, and group photo"],
            ["14:30｜啟程前往玉泉公園溫水游泳池，泳池下水前合照", "14:30 · Head to Yuquan Park Heated Pool and take a group photo before entering"],
            ["16:30｜準備換裝", "16:30 · Begin changing and packing up"],
            ["17:00｜例會結束、離開泳池", "17:00 · Meeting ends and the group leaves the pool"],
          ),
          tags: localizedList(
            ["活動流程", "Schedule"],
            ["咖啡廳集合", "Cafe meetup"],
            ["泳池行程", "Pool session"],
          ),
          imageSrc: "assets/photos/oct-swim-group-handbook.jpg",
          imageAlt: localized("游泳例會團體畫面", "Swimming meeting group photo"),
          imageCaption: localized("游泳例會現場合照。", "Group photo from the swimming meeting."),
        },
        {
          date: localized("場地資訊", "Venue notes"),
          title: localized("兩個場地都在這裡", "Venue details"),
          summary: localized(
            "咖啡廳是集合和例會進行的地點，泳池則是後半段活動場地。泳池簡介也一併附上，方便先看場地資訊。",
            "The cafe is the meeting and check-in point, while the pool hosts the second half of the activity. A pool introduction link is included as well for reference before the day.",
          ),
          details: localizedList(
            ["咖啡廳｜Ramble Cafe 漫步藍咖啡－台北北門店", "Cafe · Ramble Cafe, Taipei Beimen Branch"],
            ["泳池｜玉泉公園溫水游泳池", "Pool · Yuquan Park Heated Pool"],
            ["泳池到場時間｜約 14:40", "Expected arrival at pool · Around 14:40"],
            ["附註｜可先查看泳池簡介與場地說明", "Reference · Pool introduction and venue details are linked below"],
          ),
          tags: localizedList(
            ["場地資訊", "Venue details"],
            ["北門", "Beimen"],
            ["玉泉公園", "Yuquan Park"],
          ),
          imageSrc: "assets/photos/oct-swim-handbook-page.jpg",
          imageAlt: localized("游泳例會手冊月份頁", "October page from the swimming meeting handbook"),
          imageCaption: localized("游泳例會手冊頁。", "Swimming meeting handbook page."),
        },
      ],
      gallery: [
        galleryImage(
          "assets/photos/oct-swim-pool-scene-01.jpg",
          "游泳例會泳池活動畫面",
          "Swimming meeting pool scene",
          "游泳例會泳池活動畫面。",
          "Pool scene from the swimming meeting.",
        ),
        ...reportGallery(
          "annual-2025-10",
          5,
          "游泳例會活動紀錄",
          "Swimming meeting photo",
          "游泳例會活動現場。",
          "Swimming meeting.",
        ),
        galleryImage(
          "assets/photos/oct-swim-group-handbook.jpg",
          "游泳例會手冊擷取團體畫面",
          "Swimming meeting group photo from the handbook",
          "游泳例會團體畫面。",
          "Swimming meeting group photo.",
        ),
        galleryImage(
          "assets/photos/oct-swim-handbook-page.jpg",
          "游泳例會手冊月份頁",
          "October page from the swimming meeting handbook",
          "10 月手冊頁。",
          "October handbook spread.",
        ),
      ],
      links: [
        createLocalizedLink("查看 Ramble Cafe", "View Ramble Cafe", "https://maps.app.goo.gl/5d7Wa4Pgqm6RYzXX6?g_st=ipc"),
        createLocalizedLink("查看玉泉公園溫水游泳池", "View Yuquan Park Heated Pool", "https://maps.app.goo.gl/ehB67ymrwqjDD4519?g_st=ipc"),
        createLocalizedLink("閱讀泳池簡介", "Read the pool introduction", "https://taiwantour.net/indoor-play-water/"),
      ],
    }),
    createPhotoEvent({
      id: "2025-11-textile",
      year: 2025,
      month: 11,
      order: 6,
      title: localized("紡織例會", "Textile Meeting"),
      subtitle: localized(
        "11 月第一場例會，把手作和講師分享放在同一個下午。",
        "November opens with an afternoon of making and conversation.",
      ),
      folder: localized("11月活動_紡織例會", "November Activities — Textile Meeting"),
      date: "2025/11/8",
      location: localized("臺大集思會議中心 B1 達文西廳", "GIS NTU Convention Center, B1 Da Vinci Hall"),
      accent: "#7c5a68",
      coverSrc: "assets/photos/nov-textile-group-photo.jpg",
      coverAlt: localized("紡織例會手作品展示畫面", "Textile meeting display photo"),
      summary: localized(
        "十一月的第一場例會，邀請瑤池藝術工作室創辦人賴綉丹擔任講師。從劇場服裝設計到成立自己的工作室，她先和大家分享一路走來的設計經驗，再帶著夥伴親手完成紡織作品。對不少人來說，這是第一次真正接觸紡織與縫紉，從一開始對材料與工具有些陌生，到最後拿著自己完成的作品合照，短短一個下午也體驗了一次從零到有的成就感。",
        "November's first meeting welcomed Lai Hsiu-Dan, founder of Yaochi Art Studio. She spoke about her path from theatre costume design to running her own studio, then guided everyone through making a textile piece by hand. For many members, it was a first experience with fabric and sewing tools. By the end of the afternoon, each person had a finished piece to hold up for the camera.",
      ),
      highlights: localizedList(
        ["紡織手作", "Textile workshop"],
        ["賴綉丹", "Lai Hsiu-Dan"],
        ["節慶手作", "Holiday craft"],
        ["臺大集思", "NTU venue"],
      ),
      availability: localized(
        "這場例會把講師介紹、實作流程和宣傳資訊都整理在一起，也補上了活動宣傳圖。",
        "This meeting now brings the speaker intro, workshop schedule, and promo material together in one place.",
      ),
      activityBlocks: [
        {
          date: localized("活動簡介", "Overview"),
          title: localized("這場手作例會", "What this session is"),
          summary: localized(
            "如果想做一件能帶走的小作品，或只是想留一個安靜做手作的下午，這場紡織例會很剛好。從報到、講師分享到實際動手做，時間都排得很完整。",
            "If you want to leave with a finished handmade piece, or simply spend an afternoon making something at an unhurried pace, this textile meeting is a good fit. The day is laid out clearly from check-in through the speaker's sharing and the workshop itself.",
          ),
          details: localizedList(
            ["日期｜2025 年 11 月 8 日（六）", "Date · Saturday, November 8, 2025"],
            ["時間｜13:00–17:00", "Time · 13:00–17:00"],
            ["地點｜臺灣大學集思會議中心 B1 達文西廳", "Venue · GIS NTU Convention Center, B1 Da Vinci Hall"],
            ["交通｜公館站 2 號出口步行約 3 分鐘", "Access · About 3 minutes on foot from MRT Gongguan Station Exit 2"],
          ),
          tags: localizedList(
            ["手作體驗", "Hands-on making"],
            ["節慶小物", "Seasonal craft"],
            ["11 月例會", "November meeting"],
          ),
          imageSrc: "assets/photos/nov-textile-poster-2025-web.jpg",
          imageAlt: localized("紡織手作例會宣傳圖", "Promotional poster for the textile workshop meeting"),
          imageCaption: localized("紡織手作例會宣傳圖。", "Promotional poster for the textile meeting."),
        },
        {
          date: localized("講師", "Speaker"),
          title: localized("賴綉丹", "Lai Hsiu-Dan"),
          summary: localized(
            "講師出身輔仁大學織品服裝設計研究所，曾任劇場服裝設計師，現在經營瑤池藝術工作室。這次會從自己的設計背景出發，帶大家一起完成節慶手作。",
            "Lai Hsiu-Dan studied textile and fashion design at Fu Jen Catholic University, worked in costume design for theater, and now runs Yaochi Art Studio. For this session, she brings that background into a holiday-themed handcraft workshop.",
          ),
          details: localizedList(
            ["學歷｜輔仁大學織品服裝設計研究所", "Background · Graduate studies in textile and fashion design at Fu Jen Catholic University"],
            ["經歷｜劇場服裝設計師", "Experience · Theater costume designer"],
            ["現職｜瑤池藝術工作室創辦人", "Current role · Founder of Yaochi Art Studio"],
            ["主題｜從分享進到手作實作", "Session focus · Design sharing leading into hands-on making"],
          ),
          tags: localizedList(
            ["講師介紹", "Speaker intro"],
            ["服裝設計", "Fashion design"],
            ["瑤池藝術工作室", "Yaochi Art Studio"],
          ),
          imageSrc: "assets/photos/nov-textile-poster-2025-web.jpg",
          imageAlt: localized("紡織例會講師賴綉丹宣傳圖", "Promotional image featuring textile meeting speaker Lai Hsiu-Dan"),
          imageCaption: localized("講師與例會資訊。", "Speaker and meeting information."),
        },
        {
          date: localized("當日流程", "Schedule"),
          title: localized("11 月 8 日流程", "November 8 schedule"),
          summary: localized(
            "先報到與聯誼，再進入講師介紹、講課和手作體驗，最後留下整理場地的時間。",
            "The afternoon starts with check-in and mingling, then moves into the speaker introduction, the lesson, the workshop itself, and time to reset the room at the end.",
          ),
          details: localizedList(
            ["13:00–13:30｜報到・聯誼", "13:00–13:30 · Check-in and mingling"],
            ["13:30–14:00｜例會開始・講師簡介", "13:30–14:00 · Meeting begins and speaker intro"],
            ["14:00–14:30｜講師講課", "14:00–14:30 · Speaker session"],
            ["14:30–16:30｜體驗手作", "14:30–16:30 · Workshop time"],
            ["16:30–17:00｜例會結束・場復", "16:30–17:00 · Wrap-up and room reset"],
          ),
          tags: localizedList(
            ["活動流程", "Schedule"],
            ["手作時間", "Workshop time"],
            ["講師分享", "Speaker session"],
          ),
          imageSrc: "assets/photos/nov-textile-panel-1.jpg",
          imageAlt: localized("紡織例會現場手作分享畫面", "Sharing scene from the textile meeting"),
          imageCaption: localized("紡織例會現場。", "Scene from the textile meeting."),
        },
      ],
      gallery: [
        galleryImage(
          "assets/photos/nov-textile-poster-2025-web.jpg",
          "紡織手作例會宣傳圖",
          "Promotional poster for the textile workshop meeting",
          "紡織手作例會宣傳圖。",
          "Promotional poster for the textile meeting.",
        ),
        ...reportGallery(
          "annual-2025-11-textile",
          3,
          "紡織手作例會活動紀錄",
          "Textile workshop meeting photo",
          "紡織手作例會。",
          "Textile workshop meeting.",
        ),
        galleryImage(
          "assets/photos/nov-textile-group-photo.jpg",
          "紡織例會手作品展示畫面",
          "Textile meeting display photo",
          "紡織例會現場畫面。",
          "Textile meeting scene.",
        ),
        galleryImage(
          "assets/photos/nov-textile-group-1.jpg",
          "紡織例會活動合照",
          "Group photo from the textile meeting",
          "紡織例會活動合照。",
          "Group photo from the textile meeting.",
        ),
        galleryImage(
          "assets/photos/nov-textile-panel-1.jpg",
          "紡織例會分享與手作品展示畫面",
          "Sharing and handmade display at the textile meeting",
          "現場分享與作品展示。",
          "Sharing and handmade display on site.",
        ),
        galleryImage(
          "assets/photos/nov-textile-title-1.jpg",
          "紡織例會講師與作品合影",
          "Speaker and handmade work at the textile meeting",
          "講師與作品合影。",
          "Speaker with the finished work.",
        ),
        galleryImage(
          "assets/photos/nov-textile-handbook-page.jpg",
          "紡織例會手冊月份頁",
          "November textile meeting handbook page",
          "紡織例會手冊頁。",
          "Textile meeting handbook page.",
        ),
      ],
      links: [
        createLocalizedLink("查看活動地點", "View venue", "https://maps.app.goo.gl/hCnKvhhrh1BdjsVJ8"),
        createLocalizedLink("紡織例會報名表單", "Textile meeting registration", "https://forms.gle/b2U412D1WRwcAEET7"),
      ],
    }),
    createPhotoEvent({
      id: "2025-11-blood",
      year: 2025,
      month: 11,
      order: 6.1,
      title: localized("捐血例會", "Blood Donation Meeting"),
      subtitle: localized("把一個週六下午留給熱血與現場服務。", "A Saturday afternoon set aside for blood donation and on-site service."),
      folder: localized("11月活動_捐血例會", "November Activities — Blood Donation Meeting"),
      date: "2025/11/15",
      location: localized("信義威秀", "Vieshow Cinemas Xinyi"),
      accent: "#a15d70",
      coverSrc: "assets/photos/nov-blood-donation-group-photo.jpg",
      coverAlt: localized("捐血例會現場合照", "Blood donation meeting group photo"),
      summary: localized(
        "這一次，我們把例會變成一場真正能付諸行動的公益服務。夥伴們在信義威秀集合，符合資格的人挽起袖子參與捐血，當天不適合或無法捐血的人，也能留下來協助現場工作。有人貢獻一袋熱血，有人投入時間與人力，每一種參與方式都有它的意義。活動現場也準備了餐點、小禮物與抽獎，讓做好事的午後多了一份歡樂，也讓服務成為大家可以一起完成的日常行動。",
        "This meeting became a hands-on service afternoon at Vieshow Cinemas Xinyi. Eligible members rolled up their sleeves to donate blood, while those who could not donate stayed to help on site. Some gave blood and others gave their time; both mattered. Food, small gifts, and a prize draw kept the atmosphere light and made service something the whole group could take part in together.",
      ),
      highlights: localizedList(
        ["公益參與", "Public service"],
        ["捐血行動", "Blood donation drive"],
        ["現場服務", "On-site support"],
        ["11 月例會", "November meeting"],
      ),
      availability: localized(
        "時間、地點和聯繫方式都整理在這裡，想捐血或想來幫忙都能直接查看。",
        "Time, venue, and contact details are all gathered here, whether you plan to donate or simply help on site.",
      ),
      activityBlocks: [
        {
          date: localized("活動簡介", "Overview"),
          title: localized("11 月 15 日熱血行動", "The November 15 service afternoon"),
          summary: localized(
            "這場例會把捐血和現場支援放在同一個下午。夥伴可以依照自己的身體狀況決定是否捐血；就算不方便捐，也一樣能到場協助、陪伴和支援。",
            "This meeting brings blood donation and on-site support together in one afternoon. Members can decide whether to donate based on their own condition, and those who cannot donate are still welcome to help and be present.",
          ),
          details: localizedList(
            ["日期｜2025 年 11 月 15 日（六）", "Date · Saturday, November 15, 2025"],
            ["時間｜12:00–15:00", "Time · 12:00–15:00"],
            ["地點｜信義威秀", "Venue · Vieshow Cinemas Xinyi"],
            ["交通｜捷運市政府站、台北 101／世貿站步行可到", "Access · Walkable from MRT Taipei City Hall Station or Taipei 101/World Trade Center Station"],
          ),
          tags: localizedList(
            ["公益服務", "Community service"],
            ["捐血行動", "Blood donation drive"],
            ["信義場次", "Xinyi venue"],
          ),
          imageSrc: "assets/photos/nov-blood-donation-group-photo.jpg",
          imageAlt: localized("捐血例會現場合照", "Blood donation meeting group photo"),
          imageCaption: localized("捐血例會現場合照。", "Blood donation meeting group photo."),
        },
        {
          date: localized("現場安排", "On-site notes"),
          title: localized("捐血之外，也有服務工作", "There is more than donation"),
          summary: localized(
            "除了捐血本身，當天也安排了現場支援和交流。提早到的夥伴有主委請客先墊肚子，完成捐血後也準備了小禮和抽獎。",
            "The day includes on-site support and time to gather, not only the donation itself. Early arrivals are treated to food by the committee chair, and there are small gifts and prize draws after donating.",
          ),
          details: localizedList(
            ["提早到場｜主委請客先吃點東西", "Arrive early · Food is prepared by the committee chair for early arrivals"],
            ["完成捐血｜可領電影票、奶茶與現場小禮物", "After donating · Movie tickets, milk tea, and small gifts are available"],
            ["現場抽獎｜另有腳踏車、行李箱等抽獎品", "Prize draw · Additional gifts include items such as a bicycle and luggage"],
            ["貼心提醒｜不想捐血或當天不能捐，也可以來現場幫忙", "Note · Even if you do not donate, you are welcome to come and help"],
          ),
          tags: localizedList(
            ["現場支援", "On-site support"],
            ["公益例會", "Service meeting"],
            ["夥伴參與", "Member participation"],
          ),
          imageSrc: "assets/photos/nov-blood-donation-group-photo.jpg",
          imageAlt: localized("捐血例會夥伴合照", "Group photo from the blood donation meeting"),
          imageCaption: localized("當天到場夥伴合照。", "Group photo from the day."),
        },
      ],
      gallery: [
        galleryImage(
          "assets/photos/nov-blood-donation-group-photo.jpg",
          "捐血例會現場合照",
          "Blood donation meeting group photo",
          "捐血例會現場合照。",
          "Blood donation meeting group photo.",
        ),
        ...reportGallery(
          "annual-2025-11-blood",
          5,
          "捐血公益例會活動紀錄",
          "Blood donation meeting photo",
          "捐血公益例會。",
          "Blood donation meeting.",
        ),
      ],
      links: [
        createLocalizedLink("查看活動地點", "View venue", "https://maps.app.goo.gl/ERQUooqdTfhrkdfj6?g_st="),
        createLocalizedLink("加入現場聯繫群組", "Join the coordination group", "https://line.me/ti/g/L5n3PsS3tB"),
      ],
    }),
    createPhotoEvent({
      id: "2025-11-blockchain",
      year: 2025,
      month: 11,
      order: 6.2,
      title: localized("區塊鏈例會", "Blockchain Meeting"),
      subtitle: localized("把創業、科技應用與職涯現場放在同一個下午。", "An afternoon where entrepreneurship, technology, and career practice meet."),
      folder: localized("11月活動_區塊鏈例會", "November Activities — Blockchain Meeting"),
      date: "2025/11/29",
      location: localized("臺大集思會議中心 B1 拉斐爾廳", "GIS NTU Convention Center, B1 Raphael Hall"),
      accent: "#5a5f8e",
      coverSrc: "assets/photos/nov-blockchain-award-photo.jpg",
      coverAlt: localized("區塊鏈例會講師致謝畫面", "Blockchain meeting speaker appreciation photo"),
      summary: localized(
        "科技離生活其實沒有想像中遙遠。本次邀請 PaperPlane 創辦人暨執行長涂立青 Larry Tu，從業界角度帶大家認識區塊鏈，並延伸到創業、產品策略、營運與科技在實體產業中的應用。比起只介紹艱深的技術原理，講座更著重真實世界中如何使用這些工具，以及不同專業背景的人如何進入相關領域。現場提問與交流熱烈，也讓大家從更多角度重新認識快速變化的科技產業。",
        "Technology is closer to everyday life than it first appears. Larry Tu, founder and CEO of PaperPlane, introduced blockchain through the practical work of building companies, shaping products, running operations, and applying technology in physical businesses. Rather than staying with technical theory, the talk focused on how these tools are used and how people from different backgrounds can enter the field. A lively question session rounded out the afternoon.",
      ),
      highlights: localizedList(
        ["區塊鏈", "Blockchain"],
        ["職業例會", "Professional meeting"],
        ["PaperPlane", "PaperPlane"],
        ["科技應用", "Technology in practice"],
      ),
      availability: localized(
        "講師資料、活動流程、報名連結和宣傳圖都補在這裡了。",
        "The speaker profile, schedule, registration link, and poster are all included here.",
      ),
      activityBlocks: [
        {
          date: localized("活動簡介", "Overview"),
          title: localized("區塊鏈職業例會", "The blockchain career session"),
          summary: localized(
            "這場分享不只談區塊鏈技術本身，也把題目拉回創業、產品和營運現場。從區塊鏈如何進入真實產業，到不同職能怎麼理解這個領域，整場例會更像一次完整的職涯對話。",
            "This session is not only about blockchain technology itself. It brings the topic back to startups, products, and operations, opening a fuller career conversation around how blockchain enters real industries and how different roles can approach the field.",
          ),
          details: localizedList(
            ["日期｜2025 年 11 月 29 日（六）", "Date · Saturday, November 29, 2025"],
            ["時間｜13:00–17:00（13:30 例會開始）", "Time · 13:00–17:00 (meeting begins at 13:30)"],
            ["地點｜臺灣大學集思會議中心 B1 拉斐爾廳", "Venue · GIS NTU Convention Center, B1 Raphael Hall"],
            ["交通｜公館站 2 號出口步行約 3 分鐘", "Access · About 3 minutes on foot from MRT Gongguan Station Exit 2"],
          ),
          tags: localizedList(
            ["職涯分享", "Career talk"],
            ["科技應用", "Technology in practice"],
            ["創業實務", "Startup practice"],
          ),
          imageSrc: "assets/photos/nov-blockchain-poster-2025-web.jpg",
          imageAlt: localized("區塊鏈例會宣傳圖", "Promotional poster for the blockchain meeting"),
          imageCaption: localized("區塊鏈例會宣傳圖。", "Promotional poster for the blockchain meeting."),
        },
        {
          date: localized("講師", "Speaker"),
          title: localized("涂立青 Larry Tu", "Larry Tu"),
          summary: localized(
            "講師現為 PaperPlane 創辦人暨執行長，也曾獲選《數位時代》台灣區塊鏈 30 大影響力人物。這次會從自己的實務經驗出發，談技術、產品與執行如何一起落地。",
            "Larry Tu is the founder and CEO of PaperPlane and was selected by Business Next as one of Taiwan's 30 most influential figures in blockchain. This session draws from his hands-on work across technology, products, and execution.",
          ),
          details: localizedList(
            ["現職｜PaperPlane 創辦人暨執行長", "Current role · Founder and CEO of PaperPlane"],
            ["經歷｜8 年 AI、區塊鏈與 Martech 經驗", "Experience · 8 years across AI, blockchain, and martech"],
            ["2016｜開發 FB Chatbot，健康類別全球第一，累積逾 20 萬用戶", "2016 · Built a Facebook chatbot that became a global leader in the health category with more than 200,000 users"],
            ["2018｜打造跨境穩定幣支付系統，月交易額突破 400 萬美元", "2018 · Built a cross-border stablecoin payment system handling over USD 4 million in monthly volume"],
            ["2020｜發展數據與行銷科技平台，服務 Kakao Friends、黑松等品牌", "2020 · Developed a data and marketing technology platform serving brands including Kakao Friends and HeySong"],
          ),
          tags: localizedList(
            ["講師介紹", "Speaker profile"],
            ["PaperPlane", "PaperPlane"],
            ["產業實務", "Industry practice"],
          ),
          imageSrc: "assets/photos/nov-blockchain-speaker-portrait.jpg",
          imageAlt: localized("區塊鏈例會講師涂立青與活動合影", "Portrait of blockchain meeting speaker Larry Tu"),
          imageCaption: localized("講師與活動現場。", "Speaker and scene from the event."),
        },
        {
          date: localized("當日流程", "Schedule"),
          title: localized("11 月 29 日流程", "November 29 schedule"),
          summary: localized(
            "下午從報到與講師分享開始，接著安排提問討論，最後進行場地復原。",
            "From check-in to the main talk, questions, and close-out, the meeting sets aside a full afternoon for the topic.",
          ),
          details: localizedList(
            ["13:00–13:30｜報到・聯誼", "13:00–13:30 · Check-in and mingling"],
            ["13:30–14:00｜例會開始・講師簡介", "13:30–14:00 · Meeting begins and speaker introduction"],
            ["14:00–16:00｜講師講課", "14:00–16:00 · Main session"],
            ["16:00–16:30｜提問・討論", "16:00–16:30 · Questions and discussion"],
            ["16:30–17:00｜例會結束・場復", "16:30–17:00 · Wrap-up and room reset"],
          ),
          tags: localizedList(
            ["活動流程", "Schedule"],
            ["講座分享", "Talk"],
            ["提問討論", "Discussion"],
          ),
          imageSrc: "assets/photos/nov-blockchain-award-photo.jpg",
          imageAlt: localized("區塊鏈例會講師致謝畫面", "Speaker appreciation moment from the blockchain meeting"),
          imageCaption: localized("區塊鏈例會講師致謝畫面。", "Speaker appreciation moment from the blockchain meeting."),
        },
      ],
      gallery: [
        galleryImage(
          "assets/photos/nov-blockchain-poster-2025-web.jpg",
          "區塊鏈例會宣傳圖",
          "Promotional poster for the blockchain meeting",
          "區塊鏈例會宣傳圖。",
          "Promotional poster for the blockchain meeting.",
        ),
        ...reportGallery(
          "annual-2025-11-blockchain",
          8,
          "區塊鏈職業例會活動紀錄",
          "Blockchain career meeting photo",
          "區塊鏈職業例會。",
          "Blockchain career meeting.",
        ),
        galleryImage(
          "assets/photos/nov-blockchain-award-photo.jpg",
          "區塊鏈例會講師致謝畫面",
          "Blockchain meeting speaker appreciation photo",
          "區塊鏈例會講師致謝畫面。",
          "Speaker appreciation moment from the blockchain meeting.",
        ),
        galleryImage(
          "assets/photos/nov-blockchain-speaker-portrait.jpg",
          "區塊鏈例會合影",
          "Blockchain meeting portrait photo",
          "區塊鏈例會合影。",
          "Portrait photo from the blockchain meeting.",
        ),
        galleryImage(
          "assets/photos/nov-blockchain-group-photo.jpg",
          "區塊鏈例會現場團體畫面",
          "Blockchain meeting group photo",
          "區塊鏈例會現場團體畫面。",
          "Group photo from the blockchain meeting.",
        ),
      ],
      links: [
        createLocalizedLink("查看活動地點", "View venue", "https://maps.app.goo.gl/hCnKvhhrh1BdjsVJ8"),
        createLocalizedLink("區塊鏈例會報名表單", "Blockchain meeting registration", "https://forms.gle/o4Qxa4bNDUxoRQ239"),
        createLocalizedLink("閱讀講師報導", "Read the speaker profile", "https://web3plus.bnext.com.tw/article/3248?"),
      ],
    }),
    createPhotoEvent({
      id: "2025-12",
      year: 2025,
      month: 12,
      order: 7,
      title: localized("街友送餐公益服務", "Meal Service for Unhoused People"),
      subtitle: localized("在教室完成料理與打包，傍晚再把熱食送出去。", "Cooking, packing, and evening meal delivery all unfold in one day."),
      folder: localized("12月例會_街友送餐", "December Activities — Meal Service"),
      date: "2025/12/13",
      location: localized("永老師烹飪教室", "Chef Yong Cooking Studio"),
      accent: "#93604f",
      coverSrc: "assets/photos/dec-meals-dec13-group-01.jpg",
      coverAlt: localized("12月13日公益送餐例會合影", "13 December community meal service group photo"),
      summary: localized(
        "歲末的例會，我們選擇一起做一件溫暖的事。夥伴們在永老師烹飪教室集合，從備料、料理到打包都親手完成，再帶著一份份剛準備好的熱食前往艋舺公園與台北車站發送。這一天沒有單純坐著聽講座，而是每個人都捲起袖子加入其中。從廚房一路走到街頭，親手把餐點交出去，也讓服務不再只是一個抽象的概念，而是一份真正送到他人手中的心意。",
        "For the final meeting of the year, members gathered at Chef Yong Cooking Studio to prepare a warm meal together. Every step, from washing and cooking to packing, was done by hand before the group carried the food to Monga Park and Taipei Main Station. It was an afternoon spent working side by side, followed by the simple act of placing each meal directly into another person's hands.",
      ),
      highlights: localizedList(
        ["街友送餐", "Meal service"],
        ["社會服務", "Community outreach"],
        ["料理備餐", "Cooking and prep"],
        ["歲末關懷", "Year-end care"],
      ),
      availability: localized(
        "流程、地點和報名連結都整理在這裡，想參加備餐或現場發送都可以直接查看。",
        "The full schedule, venue, and registration link are all gathered here for anyone joining the cooking or the meal delivery.",
      ),
      activityBlocks: [
        {
          date: localized("活動簡介", "Overview"),
          title: localized("12 月 13 日送餐例會", "The December 13 meal service"),
          summary: localized(
            "這場例會從教室裡的一頓熱食開始。大家一起料理、打包，再把剛完成的餐點送到艋舺公園和台北車站，讓歲末的聚會多了一點實際的陪伴。",
            "This meeting begins with a hot meal prepared together in the classroom. After cooking and packing, the group brings the freshly made food to Monga Park and Taipei Main Station, turning the year-end gathering into something more tangible.",
          ),
          details: localizedList(
            ["日期｜2025 年 12 月 13 日（六）", "Date · Saturday, December 13, 2025"],
            ["地點｜永老師烹飪教室", "Venue · Chef Yong Cooking Studio"],
            ["地址｜台北市中正區館前路 36 號 4 樓", "Address · 4F, No. 36, Guanqian Road, Zhongzheng District, Taipei"],
            ["交通｜台北車站步行可到", "Access · Walkable from Taipei Main Station"],
          ),
          tags: localizedList(
            ["歲末公益", "Year-end service"],
            ["送餐例會", "Meal service meeting"],
            ["台北車站", "Taipei Main Station"],
          ),
          imageSrc: "assets/photos/dec-meals-dec13-group-01.jpg",
          imageAlt: localized("12月13日公益送餐例會合影", "13 December community meal service group photo"),
          imageCaption: localized("12 月 13 日送餐例會現場合照。", "Group photo from the 13 December meal service meeting."),
        },
        {
          date: localized("當日流程", "Schedule"),
          title: localized("12 月 13 日流程", "December 13 schedule"),
          summary: localized(
            "下午先在教室裡完成報到、料理與打包，傍晚整理好隊伍後，再往發送地點移動。",
            "The afternoon is spent at the classroom for check-in, cooking, and packing, before the group heads out in the evening for distribution.",
          ),
          details: localizedList(
            ["13:00–13:30｜報到、交流", "13:00–13:30 · Check-in and mingling"],
            ["13:30–14:00｜例會開始", "13:30–14:00 · Meeting begins"],
            ["14:00–15:30｜一起料理", "14:00–15:30 · Cooking together"],
            ["15:30–16:30｜打包、整隊", "15:30–16:30 · Packing and organizing the group"],
            ["16:30–17:00｜場復", "16:30–17:00 · Room reset"],
            ["17:00 後｜前往艋舺公園與台北車站送餐", "After 17:00 · Head to Monga Park and Taipei Main Station for meal delivery"],
          ),
          tags: localizedList(
            ["活動流程", "Schedule"],
            ["料理", "Cooking"],
            ["送餐", "Meal delivery"],
          ),
          imageSrc: "assets/photos/dec-meals-dec13-prep-cutting-01.jpg",
          imageAlt: localized("12月13日公益送餐例會備餐紀錄", "Meal prep during the 13 December community meal service"),
          imageCaption: localized("送餐例會備餐過程。", "Meal preparation during the service meeting."),
        },
        {
          date: localized("參加方式", "Participation"),
          title: localized("從教室到發送現場", "From kitchen to delivery"),
          summary: localized(
            "這場活動不是單純把物資交出去，而是把料理、打包和送達都親手完成。從教室出發後，大家會一起步行前往指定地點，把當天準備的熱食送出去。",
            "This is not only about handing over supplies. The group cooks, packs, and delivers together, then walks from the classroom to the designated distribution points with the meals prepared that day.",
          ),
          details: localizedList(
            ["集合點｜永老師烹飪教室", "Meeting point · Chef Yong Cooking Studio"],
            ["發送地點｜艋舺公園、台北車站", "Delivery points · Monga Park and Taipei Main Station"],
            ["適合參加｜想一起料理、打包或現場服務的夥伴", "Good fit for · Anyone who wants to cook, pack, or help on site"],
            ["備註｜活動日期刻意避開聖誕週末，不和其他安排撞期", "Note · The date was set ahead of Christmas weekend to avoid overlapping with other plans"],
          ),
          tags: localizedList(
            ["現場服務", "On-site service"],
            ["步行發送", "Walking delivery"],
            ["歲末陪伴", "Year-end companionship"],
          ),
          imageSrc: "assets/photos/dec-meals-handbook-service.jpg",
          imageAlt: localized("街友送餐公益服務發送畫面", "Meal distribution scene from the service activity"),
          imageCaption: localized("送餐現場畫面。", "Scene from the meal distribution."),
        },
      ],
      gallery: [
        galleryImage(
          "assets/photos/dec-meals-dec13-group-01.jpg",
          "12月13日公益送餐例會合影",
          "13 December community meal service group photo",
          "12月13日公益送餐例會合影。",
          "Group photo from the 13 December community meal service meeting.",
        ),
        ...reportGallery(
          "annual-2025-12",
          13,
          "街友送餐公益服務活動紀錄",
          "Community meal service photo",
          "街友送餐公益服務。",
          "Community meal service.",
        ),
        galleryImage(
          "assets/photos/dec-meals-dec13-hosts-01.jpg",
          "12月13日公益送餐例會主持與分享",
          "13 December community meal service hosts and sharing",
          "12月13日公益送餐例會主持與分享。",
          "Hosts and sharing during the 13 December community meal service meeting.",
        ),
        galleryImage(
          "assets/photos/dec-meals-dec13-prep-group-01.jpg",
          "12月13日公益送餐例會食材準備",
          "13 December community meal service ingredient preparation",
          "12月13日公益送餐例會食材準備合影。",
          "Group photo during ingredient preparation for the 13 December community meal service meeting.",
        ),
        galleryImage(
          "assets/photos/dec-meals-dec13-prep-cutting-01.jpg",
          "12月13日公益送餐例會備餐紀錄",
          "13 December community meal service meal prep",
          "12月13日公益送餐例會備餐紀錄。",
          "Meal preparation in the kitchen during the 13 December community meal service meeting.",
        ),
        galleryImage(
          "assets/photos/dec-meals-dec13-hosts-02.jpg",
          "12月13日公益送餐例會主持與說明",
          "13 December community meal service opening remarks",
          "12月13日公益送餐例會主持與說明。",
          "Opening remarks during the 13 December community meal service meeting.",
        ),
        galleryImage(
          "assets/photos/dec-meals-handbook-cover.jpg",
          "街友送餐公益服務手冊人物合照",
          "Meal service portrait from the handbook",
          "手冊中的街友送餐志工合照。",
          "Volunteer group photo from the handbook.",
        ),
        galleryImage(
          "assets/photos/dec-meals-handbook-group-2.jpg",
          "街友送餐公益服務備餐人物畫面",
          "Meal prep scene from the handbook",
          "手冊中的備餐過程人物畫面。",
          "Meal prep scene from the handbook.",
        ),
        galleryImage(
          "assets/photos/dec-meals-handbook-service.jpg",
          "街友送餐公益服務發送畫面",
          "Meal distribution scene from the handbook",
          "手冊中的送餐現場畫面。",
          "Meal distribution scene from the handbook.",
        ),
      ],
      links: [
        createLocalizedLink("查看活動地點", "View venue", "https://maps.app.goo.gl/VfwSR3GRD5gUH6u76?g_st=ipc"),
        createLocalizedLink("送餐例會報名表單", "Meal service registration", "https://forms.gle/9XZmuUSPUrEJdc9u6"),
      ],
    }),
    createPhotoEvent({
      id: "2026-01",
      year: 2026,
      month: 1,
      order: 8,
      title: localized("頒獎典禮", "Award Ceremony"),
      subtitle: localized("學長姐和新一屆獎學生在頒獎典禮正式見面。", "Senior members and the new scholarship recipients meet at the ceremony."),
      folder: localized("2026年1月頒獎典禮", "January 2026 — Award Ceremony"),
      date: "2026/1/17",
      location: localized("2026.01.17 頒獎典禮", "2026.01.17 Award Ceremony"),
      accent: "#ab5f4f",
      coverSrc: "assets/photos/jan-awards-event-02.jpg",
      coverAlt: localized("頒獎典禮台上多人合照", "Award ceremony stage group photo"),
      summary: localized(
        "一年前，我們也曾是台下等待名字被念到、從扶輪前輩手中接下獎狀的獎學生；一年後，再次回到頒獎典禮，身分已悄悄改變。學長姐們協助司儀及頒獎工作，也在這一天正式迎接新一屆獎學生。手中遞出的不只是一張獎狀，更像是把自己曾經收到的鼓勵與祝福繼續往下傳。從被歡迎的人成為歡迎別人的人，或許正是聯誼會傳承最珍貴的模樣。",
        "A year earlier, many of the senior members had been sitting in the audience waiting to hear their own names. Returning to the award ceremony this time, they served as hosts and presenters while welcoming a new group of scholarship recipients. Passing each certificate forward also passed on the encouragement they had once received, turning former newcomers into the people now welcoming others.",
      ),
      highlights: localizedList(
        ["公開相簿", "Public album"],
        ["頒獎典禮", "Award ceremony"],
        ["舞台紀錄", "Stage moments"],
      ),
      availability: localized(
        "這場典禮讓新一屆獎學生與學長姐正式相見。",
        "The ceremony formally brings new recipients and senior members together.",
      ),
      gallery: [
        galleryImage(
          "assets/photos/jan-awards-event-01.jpg",
          "頒獎典禮台上合照",
          "Award ceremony group photo on stage",
          "台上合照。",
          "Group photo on stage.",
        ),
        ...reportGallery(
          "annual-2026-01",
          3,
          "頒獎典禮活動紀錄",
          "Award ceremony photo",
          "頒獎典禮。",
          "Award ceremony.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-02.jpg",
          "頒獎典禮舞台全景",
          "Wide stage view of the award ceremony",
          "舞台全景。",
          "Wide stage view.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-03.jpg",
          "頒獎典禮扶輪旗幟合照",
          "Stage photo with Rotary banners",
          "扶輪旗幟合照。",
          "Group photo with Rotary banners.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-04.jpg",
          "頒獎典禮近景合照",
          "Closer stage group photo at the award ceremony",
          "近景合照。",
          "Closer group photo.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-05.jpg",
          "頒獎典禮頒獎畫面",
          "Award presentation scene on stage",
          "頒獎畫面。",
          "Award presentation scene.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-06.jpg",
          "頒獎典禮多人上台畫面",
          "Multiple recipients on stage at the award ceremony",
          "多人上台畫面。",
          "Multiple recipients on stage.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-07.jpg",
          "頒獎典禮舞台隊列畫面",
          "Stage lineup at the award ceremony",
          "舞台隊列畫面。",
          "Stage lineup scene.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-08.jpg",
          "頒獎典禮會場全景",
          "Auditorium-wide view of the award ceremony",
          "會場全景。",
          "Auditorium-wide view.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-09.jpg",
          "頒獎典禮全體台上畫面",
          "Full on-stage group at the award ceremony",
          "全體台上畫面。",
          "Full on-stage group.",
        ),
        galleryImage(
          "assets/photos/jan-awards-event-10.jpg",
          "頒獎典禮典禮現場畫面",
          "Ceremony hall view during the award ceremony",
          "典禮現場畫面。",
          "Ceremony hall view.",
        ),
      ],
      links: [createLocalizedLink("2026.1.17 公開相簿", "Public album · 2026.1.17", "https://drive.google.com/drive/folders/1Kle3PPCBJu9I4H-XeVltSkrMaHs-E3gs?usp=drive_link")],
    }),
    createPhotoEvent({
      id: "2026-02",
      year: 2026,
      month: 2,
      order: 9,
      title: localized("北區｜新北區聯合小迎新", "Joint Mini Welcome Event"),
      subtitle: localized("用破冰與分組活動，讓新生更快熟悉彼此。", "Icebreakers and small-group activities help everyone get acquainted."),
      folder: localized("2026年2月小迎新", "February 2026 — Mini Welcome Event"),
      date: "2026/2/7",
      location: localized("迎新活動", "Welcome event"),
      accent: "#8a5b61",
      coverSrc: "assets/photos/feb-welcome-group-photo.jpg",
      coverAlt: localized("北區新北區聯合小迎新大合照", "Group photo from the joint mini welcome event"),
      summary: localized(
        "第一次見面難免有些陌生，因此小迎新就從認識彼此開始。透過扶輪與聯誼會介紹、自我介紹、破冰遊戲以及分組交流，新生們一步步認識身邊的新夥伴，也開始了解加入聯誼會之後能一起參與些什麼。從活動剛開始時還有些拘謹，到後來逐漸聊開、笑聲越來越多，這場小迎新也成為新一屆獎學生真正走進聯誼會大家庭的第一站。",
        "First meetings can feel unfamiliar, so the mini welcome event began by helping everyone get to know one another. Introductions to Rotary and the fellowship, short self-introductions, icebreakers, and small-group conversations gave new scholarship recipients an easy way into the community. The room gradually loosened up as people began talking and laughing together.",
      ),
      highlights: localizedList(
        ["小迎新", "Mini welcome"],
        ["新夥伴", "New members"],
        ["關係建立", "Connection building"],
      ),
      availability: localized(
        "破冰與交流，是這場小迎新的主軸。",
        "Icebreakers and conversation set the tone for this mini welcome event.",
      ),
      gallery: [
        galleryImage(
          "assets/photos/feb-welcome-group-photo.jpg",
          "北區新北區聯合小迎新大合照",
          "Group photo from the joint mini welcome event",
          "小迎新大合照。",
          "Mini welcome group photo.",
        ),
        ...reportGallery(
          "annual-2026-02",
          5,
          "北區新北區聯合小迎新活動紀錄",
          "Joint mini welcome event photo",
          "北區與新北區聯合小迎新。",
          "Joint mini welcome event.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-opening-photo-01.jpg",
          "北區新北區聯合小迎新共同主席開場畫面",
          "Joint mini welcome opening moment with the co-chairs",
          "共同主席宣布小迎新開始的現場畫面。",
          "The co-chairs opening the mini welcome event.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-bell-photo-01.jpg",
          "北區新北區聯合小迎新敲鐘開場畫面",
          "Bell-ringing opening moment at the joint mini welcome event",
          "共同主席敲鐘宣布活動開始。",
          "The co-chairs ring the bell to open the event.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-sharing-photo-01.jpg",
          "北區新北區聯合小迎新分享互動畫面",
          "Sharing moment at the joint mini welcome event",
          "現場交流畫面。",
          "A candid exchange during the event.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-sharing-photo-02.jpg",
          "北區新北區聯合小迎新自我介紹畫面",
          "Self-introduction moment at the joint mini welcome event",
          "新夥伴自我介紹的現場畫面。",
          "A self-introduction moment from the event.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-icebreaker-photo-01.jpg",
          "北區新北區聯合小迎新分組互動畫面",
          "Group interaction at the joint mini welcome event",
          "分組活動中的互動畫面。",
          "A group interaction during the activities.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-icebreaker-photo-02.jpg",
          "北區新北區聯合小迎新交流畫面",
          "Conversation moment at the joint mini welcome event",
          "現場交流與互動的畫面。",
          "A conversation and interaction moment during the event.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-host-photo-02.jpg",
          "北區新北區聯合小迎新主持帶領畫面",
          "Host leading the joint mini welcome event",
          "主持帶領活動進行的畫面。",
          "The host leading the event.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-sharing-photo-03.jpg",
          "北區新北區聯合小迎新分享畫面",
          "Speaker sharing at the joint mini welcome event",
          "分享環節畫面。",
          "A moment from the sharing session.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-group-handbook.jpg",
          "北區新北區聯合小迎新手冊團體畫面",
          "Mini welcome group photo from the handbook",
          "手冊團體畫面。",
          "Group photo from the handbook.",
        ),
        galleryImage(
          "assets/photos/feb-welcome-handbook-page.jpg",
          "北區新北區聯合小迎新手冊月份頁",
          "February page from the mini welcome handbook",
          "2 月手冊頁。",
          "February handbook spread.",
        ),
      ],
    }),
    createPhotoEvent({
      id: "2026-03",
      year: 2026,
      month: 3,
      order: 10,
      title: localized("五區聯合大迎新", "Five-District Welcome Camp"),
      subtitle: localized("兩天一夜的迎新安排了講座、破冰、夜市和大地遊戲。", "The two-day welcome camp includes talks, icebreakers, a night market, and field games."),
      folder: localized("2026年3月大迎新", "March 2026 — Five-District Welcome Camp"),
      date: "2026/3/7-8",
      location: localized("迎新活動", "Welcome event"),
      accent: "#8b5d70",
      coverSrc: "assets/photos/march-welcome-group-photo-web.jpg",
      coverAlt: localized("五區聯合大迎新戶外大合照", "Outdoor group photo from the five-district welcome camp"),
      summary: localized(
        "來自五個區的夥伴共同投入籌備，把一次次討論與分工化成兩天一夜的大迎新。從講座、破冰活動，到晚上的夜市與第二天的大地遊戲，每一個環節背後都有不同夥伴的投入。最有成就感的不是完成了多少流程，而是看著第一天還互不熟悉的新生，到了第二天已經能一起合作、玩鬧與合照。那些籌備期間的忙碌，也在大家真正熟悉彼此的那一刻有了意義。",
        "Members from five districts turned weeks of planning and shared tasks into a two-day welcome camp. Talks and icebreakers filled the first day, followed by a night market visit and field games the next morning. The best part was watching new members who barely knew one another on day one work, play, and take photos together by day two.",
      ),
      highlights: localizedList(
        ["大迎新", "Welcome camp"],
        ["新生加入", "New members"],
        ["五區聚會", "Five districts"],
      ),
      availability: localized(
        "兩天一夜的大迎新，讓五區新生在活動裡熟悉彼此。",
        "The overnight camp gives new members across the five districts time to get to know one another.",
      ),
      gallery: [
        galleryImage(
          "assets/photos/march-welcome-group-photo-web.jpg",
          "五區聯合大迎新戶外大合照",
          "Outdoor group photo from the five-district welcome camp",
          "大迎新戶外大合照。",
          "Outdoor welcome camp group photo.",
        ),
        ...reportGallery(
          "annual-2026-03",
          1,
          "五區聯合大迎新活動紀錄",
          "Five-district welcome camp photo",
          "五區聯合大迎新。",
          "Five-district welcome camp.",
        ),
        galleryImage(
          "assets/photos/march-welcome-handbook-cover.jpg",
          "五區聯合大迎新手冊大合照",
          "Welcome camp group photo from the handbook",
          "手冊中的大迎新合照。",
          "Welcome camp group photo from the handbook.",
        ),
        galleryImage(
          "assets/photos/march-welcome-handbook-page-web.jpg",
          "五區聯合大迎新手冊月份頁",
          "March page from the welcome camp handbook",
          "3 月手冊頁。",
          "March handbook spread.",
        ),
      ],
    }),
    createPhotoEvent({
      id: "2026-04",
      year: 2026,
      month: 4,
      order: 11,
      title: localized("淨灘公益沙排例會", "Beach Cleanup & Sand Volleyball Meeting"),
      subtitle: localized("淨灘、沙排與溫泉排在同一天。", "Cleanup, volleyball, and hot springs share the same day."),
      folder: localized("2026年4月淨灘例會", "April 2026 — Beach Cleanup Meeting"),
      date: "2026/4/11",
      location: localized("白宮行館 / 海邊淨灘", "White House Resort / beach cleanup"),
      accent: "#32707d",
      coverSrc: "assets/photos/april-beach-group-photo.jpg",
      coverAlt: localized("淨灘公益沙排例會海邊大合照", "Beach group photo from the cleanup meeting"),
      summary: localized(
        "四月，我們把服務帶到海邊。夥伴們前往白宮行館，一起沿著沙灘撿拾垃圾，用雙手為海岸環境盡一份心力。完成淨灘後，活動從公益模式切換成歡樂模式，大家在海邊打起沙灘排球，再一起享受溫泉。從彎腰撿起一片片垃圾，到最後在沙灘上奔跑嬉鬧，服務、運動與聯誼全都濃縮在同一天，也成為年度裡格外有活力的一次相聚。",
        "In April, service moved to the seaside. Members walked the beach at White House Resort collecting rubbish and caring for the coast together. Once the cleanup was finished, the group switched to beach volleyball and time in the hot springs. Service, sport, and friendship all fit into one energetic day by the water.",
      ),
      highlights: localizedList(
        ["淨灘例會", "Beach cleanup"],
        ["海邊行動", "Seaside service"],
        ["大合照", "Group photo"],
      ),
      availability: localized(
        "這一天從海邊淨灘開始，也把相聚留到行程最後。",
        "The day begins with cleanup at the shore and holds space for time together afterward.",
      ),
      gallery: [
        galleryImage(
          "assets/photos/april-beach-group-photo.jpg",
          "淨灘公益沙排例會海邊大合照",
          "Beach group photo from the cleanup meeting",
          "淨灘例會海邊大合照。",
          "Beach cleanup group photo.",
        ),
        ...reportGallery(
          "annual-2026-04",
          9,
          "淨灘公益沙排例會活動紀錄",
          "Beach cleanup and volleyball meeting photo",
          "淨灘公益沙排例會。",
          "Beach cleanup and volleyball meeting.",
        ),
        galleryImage(
          "assets/photos/april-beach-cleanup-photo-01.jpg",
          "淨灘例會海邊撿拾垃圾畫面",
          "Beach cleanup action on the shore",
          "海邊淨灘過程。",
          "A moment from the beach cleanup.",
        ),
        galleryImage(
          "assets/photos/april-beach-cleanup-photo-02.jpg",
          "淨灘例會海邊合影",
          "Beach cleanup photo by the shore",
          "淨灘後的海邊合影。",
          "A group photo by the shore after the cleanup.",
        ),
        galleryImage(
          "assets/photos/april-beach-cleanup-photo-03.jpg",
          "淨灘例會成果合影",
          "Beach cleanup results group photo",
          "淨灘成果合影。",
          "A group photo with the cleanup results.",
        ),
        galleryImage(
          "assets/photos/april-beach-handbook-page.jpg",
          "淨灘例會手冊月份頁",
          "April page from the beach cleanup handbook",
          "4 月手冊頁。",
          "April handbook spread.",
        ),
      ],
    }),
    createPhotoEvent({
      id: "2026-05",
      year: 2026,
      month: 5,
      order: 12,
      title: localized("直播產業職業例會", "Livestream Industry Meeting"),
      subtitle: localized("把自媒體、直播工作和入行判斷放進同一場講座。", "A lecture on self-media, livestream work, and deciding whether the field fits you."),
      folder: localized("2026年5月直播產業職業例會", "May 2026 — Livestream Industry Meeting"),
      date: "2026/5/23",
      location: localized("臺大集思會議中心 B1 米開朗基羅廳", "GIS NTU Convention Center, B1 Michelangelo Hall"),
      accent: "#256877",
      coverSrc: "assets/photos/may-live-event-01.jpg",
      coverAlt: localized("直播產業職業例會大合照", "Livestream industry meeting group photo"),
      summary: localized(
        "每天都在看短影音、直播與社群媒體，但鏡頭背後究竟是一個什麼樣的產業？本次雙北例會邀請前直播主兼經紀人沐飛，以第一線經驗帶大家認識自媒體與直播工作的真實樣貌。從如何入行、需要哪些能力，到產業中的工作模式與職涯選擇，讓大家不只看見螢幕前光鮮的一面，也能從業界角度思考自己是否適合投入其中，重新認識這個與 Z 世代生活密不可分的新興職業領域。",
        "Short videos, livestreams, and social media are part of everyday life, but the work behind the camera is less familiar. Former livestream host and talent manager Mu-Fei shared a first-hand view of the industry, including how people enter the field, what skills the work requires, and the career choices available beyond the screen. The talk gave members a practical way to consider whether this growing line of work might suit them.",
      ),
      highlights: localizedList(
        ["自媒體", "Self-media"],
        ["直播產業", "Livestream industry"],
        ["職業講座", "Career lecture"],
        ["雙北例會", "Joint meeting"],
      ),
      availability: localized(
        "日期、地點、報名表單和 Line 群都整理在這裡。",
        "The date, venue, registration form, and Line group are all gathered here.",
      ),
      activityBlocks: [
        {
          date: localized("活動簡介", "Overview"),
          title: localized("自媒體與直播產業講座", "The self-media and livestream lecture"),
          summary: localized(
            "這場 5 月例會想談的，不只是直播好不好玩，而是這份工作實際怎麼運作。從自媒體經營、直播現場，到素人如果想開始，可以先怎麼看自己、怎麼判斷方向，這場講座都會慢慢聊開。",
            "This May meeting is not only about whether livestreaming seems exciting. It looks at how the work actually operates, from self-media practice and the livestream environment to how someone new might assess themselves and choose a direction.",
          ),
          details: localizedList(
            ["日期｜2026 年 5 月 23 日（六）", "Date · Saturday, May 23, 2026"],
            ["時間｜13:00–17:00", "Time · 13:00–17:00"],
            ["地點｜臺灣大學集思會議中心 B1 米開朗基羅廳", "Venue · GIS NTU Convention Center, B1 Michelangelo Hall"],
            ["交通｜捷運公館站步行約 3 分鐘", "Access · About 3 minutes on foot from MRT Gongguan Station"],
          ),
          tags: localizedList(
            ["自媒體", "Self-media"],
            ["直播工作", "Livestream work"],
            ["職涯探索", "Career exploration"],
          ),
          imageSrc: "assets/photos/may-live-poster-2026.jpg",
          imageAlt: localized("直播產業職業例會宣傳圖", "Promotional poster for the livestream industry meeting"),
          imageCaption: localized("直播產業職業例會宣傳圖留存。", "Archived promotional poster for the livestream industry meeting."),
        },
        {
          date: localized("講者", "Speaker"),
          title: localized("沐飛", "Mu-Fei"),
          summary: localized(
            "這次邀請前直播主兼經紀人沐飛分享。從業界視角出發，談直播產業的工作內容、實際訓練與現場判斷，也回應大家最常問的問題：我適不適合做自媒體？直播能不能變成工作？",
            "The session invites former livestream host and talent manager Mu-Fei to speak from an industry perspective about the work itself, the training behind it, and the judgments made on the job, while also addressing common questions such as whether self-media is a fit and whether livestreaming can become real work.",
          ),
          details: localizedList(
            ["身分｜前直播主兼經紀人", "Role · Former livestream host and talent manager"],
            ["主題｜Z 世代，我該碰自媒體或直播嗎？", "Topic · For Gen Z: should I enter self-media or livestreaming?"],
            ["方向｜從業界視角談工作樣貌與入行判斷", "Focus · An industry view of the work and how to assess entry into the field"],
            ["核心問題｜適不適合、怎麼開始、之後怎麼走", "Core questions · Fit, first steps, and possible paths forward"],
          ),
          tags: localizedList(
            ["講者分享", "Speaker session"],
            ["業界視角", "Industry perspective"],
            ["直播產業", "Livestream industry"],
          ),
          imageSrc: "assets/photos/may-live-speaker.jpg",
          imageAlt: localized("直播產業職業例會講者畫面", "Speaker portrait from the livestream industry meeting"),
          imageCaption: localized("講者畫面。", "Speaker portrait."),
        },
        {
          date: localized("當日安排", "Schedule"),
          title: localized("5 月 23 日流程", "May 23 schedule"),
          summary: localized(
            "整場安排在一個下午，讓報到、分享和會後交流都能留得比較完整。",
            "The full session is set within one afternoon, leaving enough room for check-in, the talk itself, and conversation after it ends.",
          ),
          details: localizedList(
            ["13:00–17:00｜雙北例會・職業講座", "13:00–17:00 · Joint Taipei and New Taipei meeting and career lecture"],
            ["主題｜自媒體與直播產業", "Theme · Self-media and the livestream industry"],
            ["形式｜講者分享、現場交流", "Format · Speaker session and in-person exchange"],
            ["會場｜米開朗基羅廳", "Hall · Michelangelo Hall"],
          ),
          tags: localizedList(
            ["活動流程", "Schedule"],
            ["講座", "Lecture"],
            ["現場交流", "In-person exchange"],
          ),
          imageSrc: "assets/photos/may-live-event-11.jpg",
          imageAlt: localized("直播產業職業例會現場合影", "Group photo from the livestream industry meeting"),
          imageCaption: localized("直播產業職業例會現場合影。", "Group photo from the livestream industry meeting."),
        },
        {
          date: localized("參加提醒", "Notes"),
          title: localized("報名前先看這裡", "A few notes before you join"),
          summary: localized(
            "會場有提供免費紅茶和咖啡，記得自備環保杯；另外，臺大集思會議中心內不能飲食，建議先用餐再到場。",
            "Free black tea and coffee are provided on site, so bringing a reusable cup is helpful. Food is not allowed inside the venue, so it is best to eat before arriving.",
          ),
          details: localizedList(
            ["現場提供｜免費紅茶、咖啡", "Provided on site · Free black tea and coffee"],
            ["請自備｜環保杯", "Please bring · A reusable cup"],
            ["場地提醒｜會議中心內不可飲食", "Venue note · Eating is not allowed inside the convention center"],
            ["建議｜先用過餐再入場", "Suggestion · Have your meal before coming"],
          ),
          tags: localizedList(
            ["活動提醒", "Event notes"],
            ["環保杯", "Reusable cup"],
            ["場地規範", "Venue rules"],
          ),
          imageSrc: "assets/photos/may-live-event-04.jpg",
          imageAlt: localized("直播產業職業例會講座全景", "Wide lecture view from the livestream industry meeting"),
          imageCaption: localized("講座現場全景。", "Wide view of the lecture hall."),
        },
      ],
      gallery: [
        galleryImage(
          "assets/photos/may-live-poster-2026.jpg",
          "直播產業職業例會宣傳圖",
          "Promotional poster for the livestream industry meeting",
          "直播產業職業例會宣傳圖留存。",
          "Archived promotional poster for the livestream industry meeting.",
        ),
        ...reportGallery(
          "annual-2026-05",
          6,
          "直播產業職業例會活動紀錄",
          "Livestream industry meeting photo",
          "直播產業職業例會。",
          "Livestream industry meeting.",
        ),
        galleryImage(
          "assets/photos/may-live-event-11.jpg",
          "直播產業職業例會現場合影",
          "Group photo from the livestream industry meeting",
          "直播產業職業例會現場合影。",
          "Group photo from the livestream industry meeting.",
        ),
        galleryImage(
          "assets/photos/may-live-event-01.jpg",
          "直播產業職業例會大合照",
          "Livestream industry meeting group photo",
          "直播產業職業例會大合照。",
          "Group photo from the livestream industry meeting.",
        ),
        galleryImage(
          "assets/photos/may-live-event-02.jpg",
          "直播產業職業例會主持畫面",
          "Hosts at the livestream industry meeting",
          "主持畫面。",
          "Hosts on stage.",
        ),
        galleryImage(
          "assets/photos/may-live-event-03.jpg",
          "直播產業職業例會台前分享畫面",
          "Panel sharing at the livestream industry meeting",
          "台前分享畫面。",
          "Panel sharing scene.",
        ),
        galleryImage(
          "assets/photos/may-live-event-04.jpg",
          "直播產業職業例會講座全景",
          "Wide lecture view from the livestream industry meeting",
          "講座全景。",
          "Wide view of the lecture.",
        ),
        galleryImage(
          "assets/photos/may-live-event-05.jpg",
          "直播產業職業例會簡報分享畫面",
          "Slide presentation at the livestream industry meeting",
          "簡報分享畫面。",
          "Slide presentation scene.",
        ),
        galleryImage(
          "assets/photos/may-live-event-06.jpg",
          "直播產業職業例會主講畫面",
          "Speaker close-up at the livestream industry meeting",
          "主講畫面。",
          "Speaker close-up.",
        ),
        galleryImage(
          "assets/photos/may-live-event-07.jpg",
          "直播產業職業例會互動畫面",
          "Discussion moment at the livestream industry meeting",
          "現場互動畫面。",
          "Discussion moment.",
        ),
        galleryImage(
          "assets/photos/may-live-event-08.jpg",
          "直播產業職業例會合影畫面",
          "Guest photo at the livestream industry meeting",
          "會後合影畫面。",
          "Guest photo after the talk.",
        ),
        galleryImage(
          "assets/photos/may-live-event-09.jpg",
          "直播產業職業例會來賓合照",
          "Guest photo in front of the title slide",
          "來賓合照。",
          "Guest photo in front of the title slide.",
        ),
        galleryImage(
          "assets/photos/may-live-event-10.jpg",
          "直播產業職業例會交流畫面",
          "Candid conversation after the livestream industry meeting",
          "活動後交流畫面。",
          "Candid conversation after the event.",
        ),
      ],
      links: [
        createLocalizedLink("查看活動地點", "View venue", "https://maps.app.goo.gl/hCnKvhhrh1BdjsVJ8"),
        createLocalizedLink("直播例會報名表單", "Livestream meeting registration", "https://forms.gle/DemkF6KWZcL5ELYV8"),
        createLocalizedLink("加入活動 Line 群", "Join the event Line group", "https://line.me/ti/g/GGejuhT_UW"),
      ],
    }),
    createPhotoEvent({
      id: "2026-06",
      year: 2026,
      month: 6,
      order: 13,
      title: localized("雙北交接典禮", "Taipei & New Taipei Handover Ceremony"),
      subtitle: localized("詠文與婉華在 6 月底完成 25-26 年度任期。", "Victoria and Hannah completed their 2025-26 term at the end of June."),
      folder: localized("2026年6月雙北交接典禮", "June 2026 — Taipei & New Taipei Handover Ceremony"),
      date: "2026/6/27",
      location: localized("雙北交接典禮", "Taipei & New Taipei handover ceremony"),
      accent: "#8c7d9e",
      coverSrc: "assets/photos/june-2026-handover-group-photo.jpg",
      coverAlt: localized("雙北交接典禮全場合照", "Full group photo from the Taipei and New Taipei handover ceremony"),
      summary: localized(
        `一年前，婉華與詠文接下北區與新北區會長的責任。當時對接下來的工作既期待，也難免緊張；一年後再次站在交接典禮上，身後已經留下了一整年的故事。

從宜蘭幹部訓練開始，我們一起唱歌、游泳、做手作、認識區塊鏈與直播產業，也一起挽起袖子捐血、走進廚房為街友準備餐點、到海邊彎腰撿起垃圾。到了新一屆獎學生加入，我們又從曾經被迎接的人，成為籌辦小迎新、大迎新以及頒獎典禮的學長姐。

回頭看才發現，這一年真正珍貴的從來不只是完成了十五場活動，而是在一次次籌備與相聚之中，大家願意為彼此多做一點，也願意把自己曾經從扶輪獲得的支持繼續傳下去。

謝謝一路同行的幹部、獎學生夥伴，也謝謝董事長、PP Bob、PP Jasmine，以及每一位在背後給予支持與指導的扶輪前輩。因為有人願意在我們身後給予信任，我們才有機會從受獎學生一步步學習承擔、服務與帶領。

交接代表任期結束，但大家的聯繫仍會繼續。

從接受一份善意，到有能力把善意交給下一個人，也許就是我們這一年對「讓愛循環」最深刻的理解。願屬於 2025–26 年度的笑聲、友情與回憶留在每一位夥伴心中，也願這份從扶輪得到的溫暖，在下一屆、再下一屆的故事裡，繼續傳遞下去。`,
        `A year earlier, Hannah and Victoria had accepted responsibility for Taipei North and New Taipei. They began the term with anticipation and some uncertainty; when they returned to the handover ceremony a year later, a full year of shared work stood behind them.

It began with leadership training in Yilan, then moved through singing, swimming, textile making, and talks on blockchain and livestreaming. Members also donated blood, cooked meals for unhoused neighbours, cleaned the beach, and welcomed the next group of scholarship recipients through ceremonies and welcome events.

What mattered most was not simply completing fifteen activities. It was the willingness to do a little more for one another and to pass along the support once received from Rotary.

Thank you to every committee member and scholarship recipient who took part, and to the chair, PP Bob, PP Jasmine, and the Rotary mentors who offered guidance and trust throughout the year. Their support gave former scholarship recipients room to learn how to serve and lead.

The handover marks the end of a term, not the end of these relationships.

Receiving kindness and learning to pass it forward became the clearest meaning of "Let Love Continue" during this year. May the friendships and memories of 2025–26 stay with everyone who shared them, and may the same warmth continue into the years ahead.`,
      ),
      highlights: localizedList(
        ["雙北交接", "Dual-district handover"],
        ["年度卸任", "End of term"],
        ["交棒時刻", "Passing the baton"],
      ),
      availability: localized(
        "這場交接典禮，記錄 25-26 年度正式交棒的時刻。",
        "The ceremony gives the 25-26 year a formal and complete closing note.",
      ),
      gallery: [
        galleryImage(
          "assets/photos/june-2026-handover-group-photo.jpg",
          "雙北交接典禮全場合照",
          "Full group photo from the Taipei and New Taipei handover ceremony",
          "雙北交接典禮全場合照。",
          "Full group photo from the handover ceremony.",
        ),
        ...reportGallery(
          "annual-2026-06",
          6,
          "雙北交接典禮活動紀錄",
          "Taipei and New Taipei handover ceremony photo",
          "雙北交接典禮。",
          "Taipei and New Taipei handover ceremony.",
        ),
        galleryImage(
          "assets/photos/june-2026-handover-speech.jpg",
          "雙北交接典禮上詠文致詞畫面",
          "Victoria speaking at the handover ceremony",
          "詠文在典禮上的致詞畫面。",
          "Victoria speaking during the ceremony.",
        ),
        galleryImage(
          "assets/photos/june-2026-handover-portrait.jpg",
          "雙北交接典禮現場側拍",
          "Portrait from the handover ceremony venue",
          "雙北交接典禮現場側拍。",
          "A portrait from the handover ceremony venue.",
        ),
      ],
    }),
  ];

  function buildArchiveData(language = DEFAULT_LANGUAGE) {
    const safeLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
    const orderedEvents = activityEvents
      .map((event) => normalizeEvent(event, safeLanguage))
      .sort((leftEvent, rightEvent) => leftEvent.order - rightEvent.order);
    const eventById = new Map(orderedEvents.map((event) => [event.id, event]));
    const monthKeys = [...new Set(orderedEvents.map((event) => `${event.year}-${padNumber(event.month)}`))];
    const photoMonthKeys = new Set(
      orderedEvents
        .filter((event) => event.visualMode === "photo")
        .map((event) => `${event.year}-${padNumber(event.month)}`),
    );

    const filters = FILTER_DEFINITIONS.map((filter) => ({
      id: filter.id,
      label: resolveLocalizedValue(filter.label, safeLanguage),
      apply:
        filter.id === "all"
          ? (items) => items
          : (items) => items.filter((item) => item.categories.includes(filter.id)),
    }));

    const filterById = new Map(filters.map((filter) => [filter.id, filter]));
    const stats = {
      total: monthKeys.length,
      startLabel: orderedEvents[0]?.label || "",
      endLabel: orderedEvents[orderedEvents.length - 1]?.label || "",
      realPhotoMonths: photoMonthKeys.size,
    };

    return {
      orderedEvents,
      eventById,
      filters,
      filterById,
      stats,
    };
  }

  const archiveCache = new Map();

  function getArchiveData(language = DEFAULT_LANGUAGE) {
    const safeLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;

    if (!archiveCache.has(safeLanguage)) {
      archiveCache.set(safeLanguage, buildArchiveData(safeLanguage));
    }

    return archiveCache.get(safeLanguage);
  }

  window.ACTIVITY_ARCHIVE_DATA = {
    defaultLanguage: DEFAULT_LANGUAGE,
    languages: [...SUPPORTED_LANGUAGES],
    getArchiveData,
  };
})();
