(function () {
    'use strict';

    var PIXEL_ID = 'a2_ift9317orjdh';
    var CONSENT_KEY = 'kanjidon_privacy_consent';
    var CONSENT_VERSION = 1;
    var pixelLoaded = false;

    var copy = {
        en: {
            title: 'Advertising privacy',
            message: 'With your permission, we use the Reddit Pixel to measure ad results and build advertising audiences. Reddit tracking stays off until you accept.',
            reject: 'Reject',
            accept: 'Accept',
            policy: 'Privacy Policy',
            choices: 'Privacy choices',
            close: 'Close and reject'
        },
        it: {
            title: 'Privacy pubblicitaria',
            message: 'Con il tuo consenso usiamo il Reddit Pixel per misurare i risultati delle campagne e creare pubblici pubblicitari. Il tracciamento Reddit resta disattivato finché non accetti.',
            reject: 'Rifiuta',
            accept: 'Accetta',
            policy: 'Privacy Policy',
            choices: 'Scelte privacy',
            close: 'Chiudi e rifiuta'
        },
        fr: {
            title: 'Confidentialité publicitaire',
            message: 'Avec ton accord, nous utilisons le pixel Reddit pour mesurer les résultats publicitaires et créer des audiences. Le suivi Reddit reste désactivé tant que tu n’acceptes pas.',
            reject: 'Refuser',
            accept: 'Accepter',
            policy: 'Politique de confidentialité',
            choices: 'Choix de confidentialité',
            close: 'Fermer et refuser'
        },
        es: {
            title: 'Privacidad publicitaria',
            message: 'Con tu permiso, usamos el píxel de Reddit para medir los resultados de los anuncios y crear audiencias publicitarias. El seguimiento de Reddit permanece desactivado hasta que aceptes.',
            reject: 'Rechazar',
            accept: 'Aceptar',
            policy: 'Política de privacidad',
            choices: 'Opciones de privacidad',
            close: 'Cerrar y rechazar'
        },
        de: {
            title: 'Datenschutz bei Werbung',
            message: 'Mit deiner Einwilligung verwenden wir das Reddit Pixel, um Werbeergebnisse zu messen und Zielgruppen zu erstellen. Das Reddit-Tracking bleibt deaktiviert, bis du zustimmst.',
            reject: 'Ablehnen',
            accept: 'Akzeptieren',
            policy: 'Datenschutzerklärung',
            choices: 'Datenschutzauswahl',
            close: 'Schließen und ablehnen'
        },
        pt: {
            title: 'Privacidade de publicidade',
            message: 'Com a tua autorização, usamos o Pixel do Reddit para medir resultados de anúncios e criar públicos publicitários. O rastreio do Reddit fica desativado até aceitares.',
            reject: 'Recusar',
            accept: 'Aceitar',
            policy: 'Política de Privacidade',
            choices: 'Opções de privacidade',
            close: 'Fechar e recusar'
        },
        ru: {
            title: 'Конфиденциальность рекламы',
            message: 'С вашего согласия мы используем пиксель Reddit для измерения результатов рекламы и создания рекламных аудиторий. Отслеживание Reddit отключено, пока вы не согласитесь.',
            reject: 'Отклонить',
            accept: 'Принять',
            policy: 'Политика конфиденциальности',
            choices: 'Настройки конфиденциальности',
            close: 'Закрыть и отклонить'
        },
        ko: {
            title: '광고 개인정보 보호',
            message: '동의하면 광고 성과를 측정하고 광고 대상을 만들기 위해 Reddit Pixel을 사용합니다. 동의하기 전까지 Reddit 추적은 비활성화됩니다.',
            reject: '거부',
            accept: '동의',
            policy: '개인정보 처리방침',
            choices: '개인정보 선택',
            close: '닫고 거부'
        },
        zh: {
            title: '广告隐私',
            message: '经你同意后，我们会使用 Reddit Pixel 衡量广告效果并创建广告受众。在你接受之前，Reddit 跟踪会保持关闭。',
            reject: '拒绝',
            accept: '接受',
            policy: '隐私政策',
            choices: '隐私选择',
            close: '关闭并拒绝'
        },
        'zh-tw': {
            title: '廣告隱私',
            message: '經你同意後，我們會使用 Reddit Pixel 衡量廣告成效並建立廣告受眾。在你接受之前，Reddit 追蹤會保持關閉。',
            reject: '拒絕',
            accept: '接受',
            policy: '隱私權政策',
            choices: '隱私選擇',
            close: '關閉並拒絕'
        },
        ar: {
            title: 'خصوصية الإعلانات',
            message: 'بموافقتك، نستخدم Reddit Pixel لقياس نتائج الإعلانات وإنشاء جماهير إعلانية. يظل تتبع Reddit متوقفًا حتى توافق.',
            reject: 'رفض',
            accept: 'موافقة',
            policy: 'سياسة الخصوصية',
            choices: 'خيارات الخصوصية',
            close: 'إغلاق ورفض'
        },
        hi: {
            title: 'विज्ञापन गोपनीयता',
            message: 'आपकी अनुमति से हम विज्ञापन के परिणाम मापने और विज्ञापन ऑडियंस बनाने के लिए Reddit Pixel का उपयोग करते हैं। आपकी सहमति तक Reddit ट्रैकिंग बंद रहती है।',
            reject: 'अस्वीकार करें',
            accept: 'स्वीकार करें',
            policy: 'गोपनीयता नीति',
            choices: 'गोपनीयता विकल्प',
            close: 'बंद करें और अस्वीकार करें'
        },
        th: {
            title: 'ความเป็นส่วนตัวด้านโฆษณา',
            message: 'เมื่อคุณยินยอม เราจะใช้ Reddit Pixel เพื่อวัดผลโฆษณาและสร้างกลุ่มเป้าหมาย โดยการติดตามของ Reddit จะปิดอยู่จนกว่าคุณจะยอมรับ',
            reject: 'ปฏิเสธ',
            accept: 'ยอมรับ',
            policy: 'นโยบายความเป็นส่วนตัว',
            choices: 'ตัวเลือกความเป็นส่วนตัว',
            close: 'ปิดและปฏิเสธ'
        },
        vi: {
            title: 'Quyền riêng tư quảng cáo',
            message: 'Khi bạn đồng ý, chúng tôi dùng Reddit Pixel để đo hiệu quả quảng cáo và tạo đối tượng quảng cáo. Theo dõi của Reddit sẽ tắt cho đến khi bạn chấp nhận.',
            reject: 'Từ chối',
            accept: 'Chấp nhận',
            policy: 'Chính sách quyền riêng tư',
            choices: 'Lựa chọn quyền riêng tư',
            close: 'Đóng và từ chối'
        },
        id: {
            title: 'Privasi iklan',
            message: 'Dengan izinmu, kami menggunakan Reddit Pixel untuk mengukur hasil iklan dan membuat audiens iklan. Pelacakan Reddit tetap nonaktif sampai kamu menyetujuinya.',
            reject: 'Tolak',
            accept: 'Setuju',
            policy: 'Kebijakan Privasi',
            choices: 'Pilihan privasi',
            close: 'Tutup dan tolak'
        },
        ms: {
            title: 'Privasi pengiklanan',
            message: 'Dengan kebenaran anda, kami menggunakan Reddit Pixel untuk mengukur hasil iklan dan membina khalayak pengiklanan. Penjejakan Reddit kekal dimatikan sehingga anda bersetuju.',
            reject: 'Tolak',
            accept: 'Terima',
            policy: 'Dasar Privasi',
            choices: 'Pilihan privasi',
            close: 'Tutup dan tolak'
        },
        tr: {
            title: 'Reklam gizliliği',
            message: 'İzninle reklam sonuçlarını ölçmek ve reklam kitleleri oluşturmak için Reddit Pixel kullanırız. Sen kabul edene kadar Reddit takibi kapalı kalır.',
            reject: 'Reddet',
            accept: 'Kabul et',
            policy: 'Gizlilik Politikası',
            choices: 'Gizlilik tercihleri',
            close: 'Kapat ve reddet'
        },
        pl: {
            title: 'Prywatność reklam',
            message: 'Za Twoją zgodą używamy piksela Reddit do mierzenia wyników reklam i tworzenia grup odbiorców. Śledzenie Reddit pozostaje wyłączone, dopóki nie wyrazisz zgody.',
            reject: 'Odrzuć',
            accept: 'Akceptuj',
            policy: 'Polityka prywatności',
            choices: 'Ustawienia prywatności',
            close: 'Zamknij i odrzuć'
        },
        fa: {
            title: 'حریم خصوصی تبلیغات',
            message: 'با اجازه شما، از Reddit Pixel برای سنجش نتایج تبلیغات و ساخت مخاطبان تبلیغاتی استفاده می‌کنیم. ردیابی Reddit تا زمان پذیرش شما خاموش می‌ماند.',
            reject: 'رد کردن',
            accept: 'پذیرفتن',
            policy: 'سیاست حریم خصوصی',
            choices: 'انتخاب‌های حریم خصوصی',
            close: 'بستن و رد کردن'
        },
        fil: {
            title: 'Privacy sa advertising',
            message: 'Kapag pumayag ka, ginagamit namin ang Reddit Pixel para sukatin ang resulta ng ads at gumawa ng advertising audiences. Naka-off ang Reddit tracking hanggang tanggapin mo ito.',
            reject: 'Tanggihan',
            accept: 'Tanggapin',
            policy: 'Patakaran sa Privacy',
            choices: 'Mga pagpilian sa privacy',
            close: 'Isara at tanggihan'
        },
        mn: {
            title: 'Зар сурталчилгааны нууцлал',
            message: 'Таны зөвшөөрлөөр бид зар сурталчилгааны үр дүнг хэмжиж, сурталчилгааны аудитори үүсгэхийн тулд Reddit Pixel ашиглана. Таныг зөвшөөрөх хүртэл Reddit-ийн хяналт идэвхгүй байна.',
            reject: 'Татгалзах',
            accept: 'Зөвшөөрөх',
            policy: 'Нууцлалын бодлого',
            choices: 'Нууцлалын сонголт',
            close: 'Хааж татгалзах'
        },
        ro: {
            title: 'Confidențialitatea publicității',
            message: 'Cu acordul tău, folosim Reddit Pixel pentru a măsura rezultatele reclamelor și a crea audiențe publicitare. Urmărirea Reddit rămâne dezactivată până când accepți.',
            reject: 'Refuză',
            accept: 'Acceptă',
            policy: 'Politica de confidențialitate',
            choices: 'Opțiuni de confidențialitate',
            close: 'Închide și refuză'
        },
        bg: {
            title: 'Поверителност при рекламиране',
            message: 'С ваше съгласие използваме Reddit Pixel, за да измерваме резултатите от рекламите и да създаваме рекламни аудитории. Проследяването от Reddit остава изключено, докато не приемете.',
            reject: 'Отказ',
            accept: 'Приемам',
            policy: 'Политика за поверителност',
            choices: 'Настройки за поверителност',
            close: 'Затваряне и отказ'
        },
        ne: {
            title: 'विज्ञापन गोपनीयता',
            message: 'तपाईंको अनुमतिमा हामी विज्ञापनको नतिजा मापन गर्न र विज्ञापन दर्शक समूह बनाउन Reddit Pixel प्रयोग गर्छौं। तपाईंले स्वीकार नगरेसम्म Reddit ट्र्याकिङ बन्द रहन्छ।',
            reject: 'अस्वीकार',
            accept: 'स्वीकार',
            policy: 'गोपनीयता नीति',
            choices: 'गोपनीयता विकल्प',
            close: 'बन्द गरी अस्वीकार'
        },
        my: {
            title: 'ကြော်ငြာဆိုင်ရာ ကိုယ်ရေးလုံခြုံမှု',
            message: 'သင်၏ခွင့်ပြုချက်ဖြင့် ကြော်ငြာရလဒ်များကို တိုင်းတာရန်နှင့် ကြော်ငြာပရိသတ်အုပ်စုများ ဖန်တီးရန် Reddit Pixel ကို အသုံးပြုပါသည်။ သင်လက်မခံမချင်း Reddit ခြေရာခံခြင်းကို ပိတ်ထားပါသည်။',
            reject: 'ငြင်းပယ်မည်',
            accept: 'လက်ခံမည်',
            policy: 'ကိုယ်ရေးလုံခြုံမှု မူဝါဒ',
            choices: 'ကိုယ်ရေးလုံခြုံမှု ရွေးချယ်မှုများ',
            close: 'ပိတ်ပြီး ငြင်းပယ်မည်'
        },
        bn: {
            title: 'বিজ্ঞাপনের গোপনীয়তা',
            message: 'আপনার অনুমতিতে আমরা বিজ্ঞাপনের ফলাফল পরিমাপ এবং বিজ্ঞাপনের দর্শকগোষ্ঠী তৈরির জন্য Reddit Pixel ব্যবহার করি। আপনি গ্রহণ না করা পর্যন্ত Reddit ট্র্যাকিং বন্ধ থাকে।',
            reject: 'প্রত্যাখ্যান',
            accept: 'গ্রহণ',
            policy: 'গোপনীয়তা নীতি',
            choices: 'গোপনীয়তার পছন্দ',
            close: 'বন্ধ ও প্রত্যাখ্যান'
        },
        uk: {
            title: 'Конфіденційність реклами',
            message: 'За вашою згодою ми використовуємо Reddit Pixel для вимірювання результатів реклами та створення рекламних аудиторій. Відстеження Reddit залишається вимкненим, доки ви не погодитеся.',
            reject: 'Відхилити',
            accept: 'Прийняти',
            policy: 'Політика конфіденційності',
            choices: 'Налаштування конфіденційності',
            close: 'Закрити й відхилити'
        },
        uz: {
            title: 'Reklama maxfiyligi',
            message: 'Ruxsatingiz bilan reklama natijalarini o‘lchash va reklama auditoriyalarini yaratish uchun Reddit Pixel ishlatamiz. Siz rozilik bermaguningizcha Reddit kuzatuvi o‘chiq qoladi.',
            reject: 'Rad etish',
            accept: 'Qabul qilish',
            policy: 'Maxfiylik siyosati',
            choices: 'Maxfiylik tanlovlari',
            close: 'Yopish va rad etish'
        },
        si: {
            title: 'වෙළඳ දැන්වීම් රහස්‍යතාව',
            message: 'ඔබගේ අවසරය ඇතිව වෙළඳ දැන්වීම් ප්‍රතිඵල මැනීමට සහ ප්‍රචාරණ ප්‍රේක්ෂක කණ්ඩායම් සෑදීමට අපි Reddit Pixel භාවිත කරමු. ඔබ පිළිගන්නා තෙක් Reddit ලුහුබැඳීම අක්‍රියව පවතී.',
            reject: 'ප්‍රතික්ෂේප කරන්න',
            accept: 'පිළිගන්න',
            policy: 'රහස්‍යතා ප්‍රතිපත්තිය',
            choices: 'රහස්‍යතා තේරීම්',
            close: 'වසා ප්‍රතික්ෂේප කරන්න'
        },
        ta: {
            title: 'விளம்பரத் தனியுரிமை',
            message: 'உங்கள் அனுமதியுடன், விளம்பர முடிவுகளை அளவிடவும் விளம்பரப் பார்வையாளர் குழுக்களை உருவாக்கவும் Reddit Pixel-ஐப் பயன்படுத்துகிறோம். நீங்கள் ஏற்கும் வரை Reddit கண்காணிப்பு முடக்கப்பட்டிருக்கும்.',
            reject: 'நிராகரி',
            accept: 'ஏற்கவும்',
            policy: 'தனியுரிமைக் கொள்கை',
            choices: 'தனியுரிமைத் தேர்வுகள்',
            close: 'மூடி நிராகரி'
        },
        ur: {
            title: 'اشتہاری رازداری',
            message: 'آپ کی اجازت سے ہم اشتہارات کے نتائج ناپنے اور اشتہاری سامعین بنانے کے لیے Reddit Pixel استعمال کرتے ہیں۔ آپ کے قبول کرنے تک Reddit ٹریکنگ بند رہتی ہے۔',
            reject: 'مسترد کریں',
            accept: 'قبول کریں',
            policy: 'رازداری کی پالیسی',
            choices: 'رازداری کے اختیارات',
            close: 'بند اور مسترد کریں'
        },
        hu: {
            title: 'Hirdetési adatvédelem',
            message: 'Az engedélyeddel a Reddit Pixelt használjuk a hirdetési eredmények mérésére és hirdetési közönségek létrehozására. A Reddit-követés kikapcsolva marad, amíg el nem fogadod.',
            reject: 'Elutasítás',
            accept: 'Elfogadás',
            policy: 'Adatvédelmi irányelvek',
            choices: 'Adatvédelmi beállítások',
            close: 'Bezárás és elutasítás'
        },
        he: {
            title: 'פרטיות בפרסום',
            message: 'בהסכמתך נשתמש ב-Reddit Pixel כדי למדוד תוצאות פרסום וליצור קהלי פרסום. המעקב של Reddit נשאר כבוי עד לאישור.',
            reject: 'דחייה',
            accept: 'אישור',
            policy: 'מדיניות פרטיות',
            choices: 'אפשרויות פרטיות',
            close: 'סגירה ודחייה'
        },
        km: {
            title: 'ឯកជនភាពការផ្សាយពាណិជ្ជកម្ម',
            message: 'ដោយមានការអនុញ្ញាតពីអ្នក យើងប្រើ Reddit Pixel ដើម្បីវាស់លទ្ធផលការផ្សាយពាណិជ្ជកម្ម និងបង្កើតក្រុមអ្នកទស្សនាសម្រាប់ការផ្សាយពាណិជ្ជកម្ម។ ការតាមដានរបស់ Reddit នឹងបិទរហូតដល់អ្នកយល់ព្រម។',
            reject: 'បដិសេធ',
            accept: 'យល់ព្រម',
            policy: 'គោលការណ៍ឯកជនភាព',
            choices: 'ជម្រើសឯកជនភាព',
            close: 'បិទ និងបដិសេធ'
        },
        kn: {
            title: 'ಜಾಹೀರಾತು ಗೌಪ್ಯತೆ',
            message: 'ನಿಮ್ಮ ಅನುಮತಿಯೊಂದಿಗೆ ಜಾಹೀರಾತು ಫಲಿತಾಂಶಗಳನ್ನು ಅಳೆಯಲು ಮತ್ತು ಜಾಹೀರಾತು ಪ್ರೇಕ್ಷಕರನ್ನು ರಚಿಸಲು Reddit Pixel ಬಳಸುತ್ತೇವೆ. ನೀವು ಒಪ್ಪುವವರೆಗೆ Reddit ಟ್ರ್ಯಾಕಿಂಗ್ ಆಫ್ ಆಗಿರುತ್ತದೆ.',
            reject: 'ನಿರಾಕರಿಸಿ',
            accept: 'ಒಪ್ಪಿಕೊಳ್ಳಿ',
            policy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
            choices: 'ಗೌಪ್ಯತಾ ಆಯ್ಕೆಗಳು',
            close: 'ಮುಚ್ಚಿ ಮತ್ತು ನಿರಾಕರಿಸಿ'
        },
        mr: {
            title: 'जाहिरात गोपनीयता',
            message: 'तुमच्या परवानगीने आम्ही जाहिरातींचे परिणाम मोजण्यासाठी आणि जाहिरात प्रेक्षक तयार करण्यासाठी Reddit Pixel वापरतो. तुम्ही स्वीकारेपर्यंत Reddit ट्रॅकिंग बंद राहते.',
            reject: 'नकार द्या',
            accept: 'स्वीकारा',
            policy: 'गोपनीयता धोरण',
            choices: 'गोपनीयता पर्याय',
            close: 'बंद करा आणि नकार द्या'
        },
        te: {
            title: 'ప్రకటనల గోప్యత',
            message: 'మీ అనుమతితో ప్రకటనల ఫలితాలను కొలవడానికి మరియు ప్రకటన ప్రేక్షకులను రూపొందించడానికి Reddit Pixel‌ను ఉపయోగిస్తాము. మీరు అంగీకరించే వరకు Reddit ట్రాకింగ్ ఆఫ్‌లో ఉంటుంది.',
            reject: 'తిరస్కరించండి',
            accept: 'అంగీకరించండి',
            policy: 'గోప్యతా విధానం',
            choices: 'గోప్యతా ఎంపికలు',
            close: 'మూసి తిరస్కరించండి'
        },
        nl: {
            title: 'Advertentieprivacy',
            message: 'Met jouw toestemming gebruiken we de Reddit Pixel om advertentieresultaten te meten en advertentiedoelgroepen te maken. Reddit-tracking blijft uit totdat je akkoord gaat.',
            reject: 'Weigeren',
            accept: 'Accepteren',
            policy: 'Privacybeleid',
            choices: 'Privacykeuzes',
            close: 'Sluiten en weigeren'
        },
        fi: {
            title: 'Mainonnan tietosuoja',
            message: 'Luvallasi käytämme Reddit Pixeliä mainostulosten mittaamiseen ja mainosyleisöjen luomiseen. Reddit-seuranta pysyy pois käytöstä, kunnes hyväksyt sen.',
            reject: 'Hylkää',
            accept: 'Hyväksy',
            policy: 'Tietosuojakäytäntö',
            choices: 'Tietosuojavalinnat',
            close: 'Sulje ja hylkää'
        },
        cs: {
            title: 'Soukromí v reklamě',
            message: 'S vaším souhlasem používáme Reddit Pixel k měření výsledků reklam a vytváření reklamních publik. Sledování Reddit zůstává vypnuté, dokud ho nepřijmete.',
            reject: 'Odmítnout',
            accept: 'Přijmout',
            policy: 'Zásady ochrany soukromí',
            choices: 'Nastavení soukromí',
            close: 'Zavřít a odmítnout'
        }
    };

    function language() {
        var value = (document.documentElement.lang || 'en').toLowerCase();
        if (value === 'zh-tw' || value === 'zh-hant') return 'zh-tw';
        value = value.split('-')[0];
        return copy[value] ? value : 'en';
    }

    function readConsent() {
        try {
            var value = JSON.parse(localStorage.getItem(CONSENT_KEY));
            return value && value.version === CONSENT_VERSION ? value.choice : null;
        } catch (error) {
            return null;
        }
    }

    function writeConsent(choice) {
        try {
            localStorage.setItem(CONSENT_KEY, JSON.stringify({
                version: CONSENT_VERSION,
                choice: choice,
                updatedAt: new Date().toISOString()
            }));
        } catch (error) {
            // If storage is unavailable, the choice still applies to this page.
        }
    }

    function expireRedditCookies() {
        ['_rdt_cid', 'rdt_cid'].forEach(function (name) {
            document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax';
            document.cookie = name + '=; Max-Age=0; Path=/; Domain=.kanjidon.com; SameSite=Lax';
        });
    }

    function loadPixel() {
        if (pixelLoaded) return;
        pixelLoaded = true;

        !function (w, d) {
            if (!w.rdt) {
                var p = w.rdt = function () {
                    p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
                };
                p.callQueue = [];
                var script = d.createElement('script');
                script.src = 'https://www.redditstatic.com/ads/pixel.js';
                script.async = true;
                var firstScript = d.getElementsByTagName('script')[0];
                firstScript.parentNode.insertBefore(script, firstScript);
            }
        }(window, document);

        window.rdt('init', PIXEL_ID);
        window.rdt('track', 'PageVisit');
    }

    function removeBanner() {
        var banner = document.getElementById('privacy-consent-banner');
        if (banner) banner.remove();
    }

    function decide(choice) {
        var wasLoaded = pixelLoaded;
        writeConsent(choice);
        removeBanner();

        if (choice === 'accepted') {
            loadPixel();
        } else {
            expireRedditCookies();
            if (wasLoaded) window.location.reload();
        }
    }

    function injectStyles() {
        if (document.getElementById('privacy-consent-styles')) return;
        var style = document.createElement('style');
        style.id = 'privacy-consent-styles';
        style.textContent =
            '#privacy-consent-banner{position:fixed;z-index:10000;left:16px;right:16px;bottom:16px;max-width:720px;margin:0 auto;padding:20px;background:#252527;color:#faf9f6;border:1px solid #3a3a3c;border-radius:16px;font-family:Nunito,system-ui,sans-serif;box-shadow:none}' +
            '#privacy-consent-banner h2{margin:0 36px 8px 0;font-size:1.2rem;line-height:1.3;color:#faf9f6}' +
            '#privacy-consent-banner p{margin:0 0 14px;font-size:.95rem;line-height:1.5;color:#d7d7dc}' +
            '#privacy-consent-banner a{color:#f08a5d;text-decoration:underline;text-underline-offset:2px}' +
            '.privacy-consent-actions{display:flex;gap:10px;flex-wrap:wrap}' +
            '.privacy-consent-button{min-width:120px;padding:10px 18px;border:2px solid #c65326;border-radius:999px;font:700 .95rem Nunito,system-ui,sans-serif;cursor:pointer}' +
            '.privacy-consent-reject{background:transparent;color:#faf9f6}' +
            '.privacy-consent-accept{background:#c65326;color:#fff}' +
            '.privacy-consent-button:focus-visible,.privacy-consent-close:focus-visible,.privacy-choices-button:focus-visible{outline:3px solid #f08a5d;outline-offset:3px}' +
            '.privacy-consent-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border:0;background:transparent;color:#faf9f6;font-size:24px;line-height:1;cursor:pointer}' +
            '.privacy-choices-button{border:0;padding:0;background:transparent;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}' +
            '@media(max-width:520px){#privacy-consent-banner{left:10px;right:10px;bottom:10px;padding:18px}.privacy-consent-actions{display:grid;grid-template-columns:1fr 1fr}.privacy-consent-button{min-width:0;width:100%;padding:11px 8px}}';
        document.head.appendChild(style);
    }

    function showBanner() {
        removeBanner();
        injectStyles();

        var text = copy[language()];
        var banner = document.createElement('section');
        banner.id = 'privacy-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'false');
        banner.setAttribute('aria-labelledby', 'privacy-consent-title');
        banner.innerHTML =
            '<button class="privacy-consent-close" type="button" aria-label="' + text.close + '">&times;</button>' +
            '<h2 id="privacy-consent-title">' + text.title + '</h2>' +
            '<p>' + text.message + ' <a href="/privacy.html">' + text.policy + '</a>.</p>' +
            '<div class="privacy-consent-actions">' +
            '<button class="privacy-consent-button privacy-consent-reject" type="button">' + text.reject + '</button>' +
            '<button class="privacy-consent-button privacy-consent-accept" type="button">' + text.accept + '</button>' +
            '</div>';

        document.body.appendChild(banner);
        banner.querySelector('.privacy-consent-close').addEventListener('click', function () { decide('rejected'); });
        banner.querySelector('.privacy-consent-reject').addEventListener('click', function () { decide('rejected'); });
        banner.querySelector('.privacy-consent-accept').addEventListener('click', function () { decide('accepted'); });
        banner.querySelector('.privacy-consent-reject').focus();
    }

    function addChoicesControl() {
        var text = copy[language()];
        var privacyLink = document.querySelector('footer a[href$="privacy.html"]');
        if (!privacyLink || document.querySelector('.privacy-choices-button')) return;

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'privacy-choices-button';
        button.textContent = text.choices;
        button.addEventListener('click', showBanner);
        privacyLink.insertAdjacentElement('afterend', button);
    }

    function start() {
        injectStyles();
        addChoicesControl();

        if (navigator.globalPrivacyControl === true) {
            writeConsent('rejected');
            expireRedditCookies();
            return;
        }

        var consent = readConsent();
        if (consent === 'accepted') loadPixel();
        else if (consent !== 'rejected') showBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
