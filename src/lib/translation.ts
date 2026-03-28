export const translations = {
    
  en: {
    // ... existing keys ...
    citizen_back: "← Back to Dashboard",
    citizen_online: "ONLINE",
    citizen_streak: "Day Streak",
    citizen_wealth: "Total Wealth",
    citizen_lvl: "LVL",
    citizen_progress: "Progress",
    citizen_to_next_lvl: "to Next Lvl",
    
    // CARDS
    citizen_card_classify_title: "WHAT IS THIS?",
    citizen_card_classify_desc: "Check Trash Type",
    citizen_card_qr_title: "I'M AT A BIN",
    citizen_card_qr_desc: "Scan QR & Earn",
    citizen_card_store_title: "SPEND CASH",
    citizen_card_store_desc: "Loot Store",
    citizen_card_track_title: "TRACK TRUCK",
    citizen_card_track_desc: "Pickup Time",
    citizen_card_events_title: "COMMUNITY EVENTS",
    citizen_card_events_desc: "Join Cleanup Drives",
    
    // LEADERBOARD WIDGET
    citizen_top_3: "Top 3",
    citizen_view_all: "View All",
    citizen_loading_ranks: "Loading Ranks...",
    citizen_your_rank: "Your Current Rank",

    // MASCOT MESSAGES
    mascot_msg_classify: "Photo analysis? Smart move.",
    mascot_msg_qr: "Scanning a Bin? I hope it's clean.",
    mascot_msg_store: "Spending money? My favorite activity!",
    mascot_msg_track: "Where is my truck? Let's check.",
    mascot_msg_events: "Join the squad. Earn massive respect.",
    // REPORT ISSUE PAGE
    report_title: "Report Issue",
    report_back: "Back",
    report_ward: "Location (Ward)",
    report_type: "Issue Type",
    report_desc: "Details",
    report_placeholder: "Describe the issue...",
    report_submit: "Submit Report",
    report_sending: "Sending...",
    report_success: "Complaint Registered Successfully!",
    report_fail: "Failed to register complaint.",

    // ISSUE TYPES (For Dropdown)
    issue_missed: "Missed Pickup",
    issue_overflow: "Overflowing Bin",
    issue_illegal: "Illegal Dumping",
    issue_dead: "Dead Animal",
    issue_staff: "Staff Misbehavior",
    issue_other: "Other"
  },
  hi: {
    // ... existing keys ...
    citizen_back: "← डैशबोर्ड पर वापस",
    citizen_online: "ऑनलाइन",
    citizen_streak: "दिन की स्ट्रीक",
    citizen_wealth: "कुल संपत्ति",
    citizen_lvl: "लेवल",
    citizen_progress: "प्रगति",
    citizen_to_next_lvl: "अगले लेवल तक",

    // CARDS
    citizen_card_classify_title: "यह क्या है?",
    citizen_card_classify_desc: "कचरे का प्रकार जांचें",
    citizen_card_qr_title: "मैं डस्टबिन पर हूँ",
    citizen_card_qr_desc: "QR स्कैन करें और कमाएं",
    citizen_card_store_title: "पैसे खर्च करें",
    citizen_card_store_desc: "लूट स्टोर",
    citizen_card_track_title: "गाड़ी ट्रैक करें",
    citizen_card_track_desc: "पिकअप का समय",
    citizen_card_events_title: "सामुदायिक कार्यक्रम",
    citizen_card_events_desc: "सफाई अभियान से जुड़ें",

    // LEADERBOARD WIDGET
    citizen_top_3: "शीर्ष 3",
    citizen_view_all: "सभी देखें",
    citizen_loading_ranks: "रैंक लोड हो रहे हैं...",
    citizen_your_rank: "आपकी वर्तमान रैंक",

    // MASCOT MESSAGES
    mascot_msg_classify: "फोटो विश्लेषण? समझदारी भरा कदम।",
    mascot_msg_qr: "डस्टबिन स्कैन कर रहे हैं? उम्मीद है साफ होगा।",
    mascot_msg_store: "पैसे खर्च करना? मेरा पसंदीदा काम!",
    mascot_msg_track: "मेरी गाड़ी कहाँ है? चलिए देखते हैं।",
    mascot_msg_events: "स्क्वाड में शामिल हों। भारी सम्मान कमाएं।",

    report_title: "समस्या की रिपोर्ट करें",
    report_back: "वापस",
    report_ward: "स्थान (वार्ड)",
    report_type: "समस्या का प्रकार",
    report_desc: "विवरण",
    report_placeholder: "समस्या का वर्णन करें...",
    report_submit: "रिपोर्ट भेजें",
    report_sending: "भेजा जा रहा है...",
    report_success: "शिकायत सफलतापूर्वक दर्ज की गई!",
    report_fail: "शिकायत दर्ज करने में विफल।",

    // ISSUE TYPES (For Dropdown)
    issue_missed: "कचरा नहीं उठाया गया",
    issue_overflow: "डस्टबिन भरा हुआ है",
    issue_illegal: "अवैध कचरा डंपिंग",
    issue_dead: "मृत जानवर",
    issue_staff: "कर्मचारी का दुर्व्यवहार",
    issue_other: "अन्य"
  },

 
};

// Helper type for TypeScript safety
export type Language = 'en' | 'hi';
export type TranslationKey = keyof typeof translations.en;