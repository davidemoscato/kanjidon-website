(function () {
    'use strict';

    var PIXEL_ID = 'a2_ift9317orjdh';
    var CONSENT_KEY = 'kanjidon_privacy_consent';
    var CONSENT_VERSION = 1;
    var pixelLoaded = false;

    var copy = {
        en: {
            title: 'Privacy',
            message: 'With your permission, we use advertising tools to measure campaign performance and create audience segments. They stay off until you accept.',
            reject: 'Reject',
            accept: 'Accept',
            policy: 'Privacy Policy',
            choices: 'Privacy choices',
            close: 'Close and reject'
        },
        it: {
            title: 'Privacy',
            message: 'Con il tuo consenso usiamo strumenti pubblicitari per misurare i risultati delle campagne e creare segmenti di pubblico. Restano disattivati finché non accetti.',
            reject: 'Rifiuta',
            accept: 'Accetta',
            policy: 'Privacy Policy',
            choices: 'Scelte privacy',
            close: 'Chiudi e rifiuta'
        },
        fr: {
            title: 'Confidentialité',
            message: 'Avec ton accord, nous utilisons des outils publicitaires pour mesurer les résultats des campagnes et créer des segments d’audience. Ils restent désactivés tant que tu n’acceptes pas.',
            reject: 'Refuser',
            accept: 'Accepter',
            policy: 'Politique de confidentialité',
            choices: 'Choix de confidentialité',
            close: 'Fermer et refuser'
        },
        es: {
            title: 'Privacidad',
            message: 'Con tu permiso, usamos herramientas publicitarias para medir los resultados de las campañas y crear segmentos de audiencia. Permanecen desactivadas hasta que aceptes.',
            reject: 'Rechazar',
            accept: 'Aceptar',
            policy: 'Política de privacidad',
            choices: 'Opciones de privacidad',
            close: 'Cerrar y rechazar'
        },
        de: {
            title: 'Datenschutz',
            message: 'Mit deiner Einwilligung verwenden wir Werbetools, um Kampagnenergebnisse zu messen und Zielgruppen zu erstellen. Sie bleiben deaktiviert, bis du zustimmst.',
            reject: 'Ablehnen',
            accept: 'Akzeptieren',
            policy: 'Datenschutzerklärung',
            choices: 'Datenschutzauswahl',
            close: 'Schließen und ablehnen'
        },
        pt: {
            title: 'Privacidade',
            message: 'Com a tua autorização, usamos ferramentas de publicidade para medir os resultados das campanhas e criar segmentos de público. Ficam desativadas até aceitares.',
            reject: 'Recusar',
            accept: 'Aceitar',
            policy: 'Política de Privacidade',
            choices: 'Opções de privacidade',
            close: 'Fechar e recusar'
        },
        ru: {
            title: 'Конфиденциальность',
            message: 'С вашего согласия мы используем рекламные инструменты для измерения результатов кампаний и создания сегментов аудитории. Они отключены, пока вы не согласитесь.',
            reject: 'Отклонить',
            accept: 'Принять',
            policy: 'Политика конфиденциальности',
            choices: 'Настройки конфиденциальности',
            close: 'Закрыть и отклонить'
        },
        ko: {
            title: '개인정보 보호',
            message: '동의하면 캠페인 성과를 측정하고 잠재고객 세그먼트를 만들기 위해 광고 도구를 사용합니다. 동의하기 전까지 비활성화됩니다.',
            reject: '거부',
            accept: '동의',
            policy: '개인정보 처리방침',
            choices: '개인정보 선택',
            close: '닫고 거부'
        },
        zh: {
            title: '隐私',
            message: '经你同意后，我们会使用广告工具衡量广告活动效果并创建受众群体。在你接受之前，这些工具会保持关闭。',
            reject: '拒绝',
            accept: '接受',
            policy: '隐私政策',
            choices: '隐私选择',
            close: '关闭并拒绝'
        },
        'zh-tw': {
            title: '隱私',
            message: '經你同意後，我們會使用廣告工具衡量廣告活動成效並建立受眾群體。在你接受之前，這些工具會保持關閉。',
            reject: '拒絕',
            accept: '接受',
            policy: '隱私權政策',
            choices: '隱私選擇',
            close: '關閉並拒絕'
        },
        ar: {
            title: 'الخصوصية',
            message: 'بموافقتك، نستخدم أدوات إعلانية لقياس نتائج الحملات وإنشاء شرائح جمهور. تظل هذه الأدوات متوقفة حتى توافق.',
            reject: 'رفض',
            accept: 'موافقة',
            policy: 'سياسة الخصوصية',
            choices: 'خيارات الخصوصية',
            close: 'إغلاق ورفض'
        },
        hi: {
            title: 'गोपनीयता',
            message: 'आपकी अनुमति से हम अभियान के परिणाम मापने और ऑडियंस समूह बनाने के लिए विज्ञापन टूल का उपयोग करते हैं। आपकी सहमति तक ये बंद रहते हैं।',
            reject: 'अस्वीकार करें',
            accept: 'स्वीकार करें',
            policy: 'गोपनीयता नीति',
            choices: 'गोपनीयता विकल्प',
            close: 'बंद करें और अस्वीकार करें'
        },
        th: {
            title: 'ความเป็นส่วนตัว',
            message: 'เมื่อคุณยินยอม เราจะใช้เครื่องมือโฆษณาเพื่อวัดผลแคมเปญและสร้างกลุ่มเป้าหมาย เครื่องมือเหล่านี้จะปิดอยู่จนกว่าคุณจะยอมรับ',
            reject: 'ปฏิเสธ',
            accept: 'ยอมรับ',
            policy: 'นโยบายความเป็นส่วนตัว',
            choices: 'ตัวเลือกความเป็นส่วนตัว',
            close: 'ปิดและปฏิเสธ'
        },
        vi: {
            title: 'Quyền riêng tư',
            message: 'Khi bạn đồng ý, chúng tôi dùng công cụ quảng cáo để đo hiệu quả chiến dịch và tạo nhóm đối tượng. Các công cụ này sẽ tắt cho đến khi bạn chấp nhận.',
            reject: 'Từ chối',
            accept: 'Chấp nhận',
            policy: 'Chính sách quyền riêng tư',
            choices: 'Lựa chọn quyền riêng tư',
            close: 'Đóng và từ chối'
        },
        id: {
            title: 'Privasi',
            message: 'Dengan izinmu, kami menggunakan alat periklanan untuk mengukur hasil kampanye dan membuat segmen audiens. Alat ini tetap nonaktif sampai kamu menyetujuinya.',
            reject: 'Tolak',
            accept: 'Setuju',
            policy: 'Kebijakan Privasi',
            choices: 'Pilihan privasi',
            close: 'Tutup dan tolak'
        },
        ms: {
            title: 'Privasi',
            message: 'Dengan kebenaran anda, kami menggunakan alat pengiklanan untuk mengukur hasil kempen dan membina segmen khalayak. Alat ini kekal dimatikan sehingga anda bersetuju.',
            reject: 'Tolak',
            accept: 'Terima',
            policy: 'Dasar Privasi',
            choices: 'Pilihan privasi',
            close: 'Tutup dan tolak'
        },
        tr: {
            title: 'Gizlilik',
            message: 'İzninle kampanya sonuçlarını ölçmek ve kitle segmentleri oluşturmak için reklam araçları kullanırız. Sen kabul edene kadar kapalı kalırlar.',
            reject: 'Reddet',
            accept: 'Kabul et',
            policy: 'Gizlilik Politikası',
            choices: 'Gizlilik tercihleri',
            close: 'Kapat ve reddet'
        },
        pl: {
            title: 'Prywatność',
            message: 'Za Twoją zgodą używamy narzędzi reklamowych do mierzenia wyników kampanii i tworzenia segmentów odbiorców. Pozostają wyłączone, dopóki nie wyrazisz zgody.',
            reject: 'Odrzuć',
            accept: 'Akceptuj',
            policy: 'Polityka prywatności',
            choices: 'Ustawienia prywatności',
            close: 'Zamknij i odrzuć'
        },
        fa: {
            title: 'حریم خصوصی',
            message: 'با اجازه شما، از ابزارهای تبلیغاتی برای سنجش نتایج کمپین‌ها و ساخت بخش‌های مخاطبان استفاده می‌کنیم. این ابزارها تا زمان پذیرش شما خاموش می‌مانند.',
            reject: 'رد کردن',
            accept: 'پذیرفتن',
            policy: 'سیاست حریم خصوصی',
            choices: 'انتخاب‌های حریم خصوصی',
            close: 'بستن و رد کردن'
        },
        fil: {
            title: 'Privacy',
            message: 'Kapag pumayag ka, gumagamit kami ng mga advertising tool para sukatin ang resulta ng campaign at gumawa ng mga audience segment. Naka-off ang mga ito hanggang tanggapin mo.',
            reject: 'Tanggihan',
            accept: 'Tanggapin',
            policy: 'Patakaran sa Privacy',
            choices: 'Mga pagpilian sa privacy',
            close: 'Isara at tanggihan'
        },
        mn: {
            title: 'Нууцлал',
            message: 'Таны зөвшөөрлөөр бид кампанит ажлын үр дүнг хэмжиж, үзэгчдийн сегмент үүсгэхийн тулд сурталчилгааны хэрэгсэл ашиглана. Таныг зөвшөөрөх хүртэл эдгээр нь идэвхгүй байна.',
            reject: 'Татгалзах',
            accept: 'Зөвшөөрөх',
            policy: 'Нууцлалын бодлого',
            choices: 'Нууцлалын сонголт',
            close: 'Хааж татгалзах'
        },
        ro: {
            title: 'Confidențialitate',
            message: 'Cu acordul tău, folosim instrumente publicitare pentru a măsura rezultatele campaniilor și a crea segmente de audiență. Rămân dezactivate până când accepți.',
            reject: 'Refuză',
            accept: 'Acceptă',
            policy: 'Politica de confidențialitate',
            choices: 'Opțiuni de confidențialitate',
            close: 'Închide și refuză'
        },
        bg: {
            title: 'Поверителност',
            message: 'С ваше съгласие използваме рекламни инструменти, за да измерваме резултатите от кампаниите и да създаваме сегменти от аудитории. Те остават изключени, докато не приемете.',
            reject: 'Отказ',
            accept: 'Приемам',
            policy: 'Политика за поверителност',
            choices: 'Настройки за поверителност',
            close: 'Затваряне и отказ'
        },
        ne: {
            title: 'गोपनीयता',
            message: 'तपाईंको अनुमतिमा हामी अभियानको नतिजा मापन गर्न र दर्शक समूह बनाउन विज्ञापन उपकरण प्रयोग गर्छौं। तपाईंले स्वीकार नगरेसम्म यी बन्द रहन्छन्।',
            reject: 'अस्वीकार',
            accept: 'स्वीकार',
            policy: 'गोपनीयता नीति',
            choices: 'गोपनीयता विकल्प',
            close: 'बन्द गरी अस्वीकार'
        },
        my: {
            title: 'ကိုယ်ရေးလုံခြုံမှု',
            message: 'သင်၏ခွင့်ပြုချက်ဖြင့် ကမ်ပိန်းရလဒ်များကို တိုင်းတာရန်နှင့် ပရိသတ်အုပ်စုများ ဖန်တီးရန် ကြော်ငြာကိရိယာများကို အသုံးပြုပါသည်။ သင်လက်မခံမချင်း ၎င်းတို့ကို ပိတ်ထားပါသည်။',
            reject: 'ငြင်းပယ်မည်',
            accept: 'လက်ခံမည်',
            policy: 'ကိုယ်ရေးလုံခြုံမှု မူဝါဒ',
            choices: 'ကိုယ်ရေးလုံခြုံမှု ရွေးချယ်မှုများ',
            close: 'ပိတ်ပြီး ငြင်းပယ်မည်'
        },
        bn: {
            title: 'গোপনীয়তা',
            message: 'আপনার অনুমতিতে আমরা প্রচারের ফলাফল পরিমাপ এবং দর্শকগোষ্ঠী তৈরির জন্য বিজ্ঞাপন সরঞ্জাম ব্যবহার করি। আপনি গ্রহণ না করা পর্যন্ত এগুলো বন্ধ থাকে।',
            reject: 'প্রত্যাখ্যান',
            accept: 'গ্রহণ',
            policy: 'গোপনীয়তা নীতি',
            choices: 'গোপনীয়তার পছন্দ',
            close: 'বন্ধ ও প্রত্যাখ্যান'
        },
        uk: {
            title: 'Конфіденційність',
            message: 'За вашою згодою ми використовуємо рекламні інструменти для вимірювання результатів кампаній і створення сегментів аудиторії. Вони залишаються вимкненими, доки ви не погодитеся.',
            reject: 'Відхилити',
            accept: 'Прийняти',
            policy: 'Політика конфіденційності',
            choices: 'Налаштування конфіденційності',
            close: 'Закрити й відхилити'
        },
        uz: {
            title: 'Maxfiylik',
            message: 'Ruxsatingiz bilan kampaniya natijalarini o‘lchash va auditoriya segmentlarini yaratish uchun reklama vositalaridan foydalanamiz. Siz rozilik bermaguningizcha ular o‘chiq qoladi.',
            reject: 'Rad etish',
            accept: 'Qabul qilish',
            policy: 'Maxfiylik siyosati',
            choices: 'Maxfiylik tanlovlari',
            close: 'Yopish va rad etish'
        },
        si: {
            title: 'රහස්‍යතාව',
            message: 'ඔබගේ අවසරය ඇතිව ප්‍රචාරණ ප්‍රතිඵල මැනීමට සහ ප්‍රේක්ෂක කණ්ඩායම් සෑදීමට අපි වෙළඳ දැන්වීම් මෙවලම් භාවිත කරමු. ඔබ පිළිගන්නා තෙක් ඒවා අක්‍රියව පවතී.',
            reject: 'ප්‍රතික්ෂේප කරන්න',
            accept: 'පිළිගන්න',
            policy: 'රහස්‍යතා ප්‍රතිපත්තිය',
            choices: 'රහස්‍යතා තේරීම්',
            close: 'වසා ප්‍රතික්ෂේප කරන්න'
        },
        ta: {
            title: 'தனியுரிமை',
            message: 'உங்கள் அனுமதியுடன், பிரச்சார முடிவுகளை அளவிடவும் பார்வையாளர் பிரிவுகளை உருவாக்கவும் விளம்பரக் கருவிகளைப் பயன்படுத்துகிறோம். நீங்கள் ஏற்கும் வரை அவை முடக்கப்பட்டிருக்கும்.',
            reject: 'நிராகரி',
            accept: 'ஏற்கவும்',
            policy: 'தனியுரிமைக் கொள்கை',
            choices: 'தனியுரிமைத் தேர்வுகள்',
            close: 'மூடி நிராகரி'
        },
        ur: {
            title: 'رازداری',
            message: 'آپ کی اجازت سے ہم مہم کے نتائج ناپنے اور سامعین کے حصے بنانے کے لیے اشتہاری ٹولز استعمال کرتے ہیں۔ آپ کے قبول کرنے تک یہ بند رہتے ہیں۔',
            reject: 'مسترد کریں',
            accept: 'قبول کریں',
            policy: 'رازداری کی پالیسی',
            choices: 'رازداری کے اختیارات',
            close: 'بند اور مسترد کریں'
        },
        hu: {
            title: 'Adatvédelem',
            message: 'Az engedélyeddel hirdetési eszközöket használunk a kampányeredmények mérésére és közönségszegmensek létrehozására. Kikapcsolva maradnak, amíg el nem fogadod.',
            reject: 'Elutasítás',
            accept: 'Elfogadás',
            policy: 'Adatvédelmi irányelvek',
            choices: 'Adatvédelmi beállítások',
            close: 'Bezárás és elutasítás'
        },
        he: {
            title: 'פרטיות',
            message: 'בהסכמתך נשתמש בכלי פרסום כדי למדוד את תוצאות הקמפיינים וליצור פלחי קהל. הכלים יישארו כבויים עד לאישור.',
            reject: 'דחייה',
            accept: 'אישור',
            policy: 'מדיניות פרטיות',
            choices: 'אפשרויות פרטיות',
            close: 'סגירה ודחייה'
        },
        km: {
            title: 'ឯកជនភាព',
            message: 'ដោយមានការអនុញ្ញាតពីអ្នក យើងប្រើឧបករណ៍ផ្សាយពាណិជ្ជកម្មដើម្បីវាស់លទ្ធផលយុទ្ធនាការ និងបង្កើតក្រុមអ្នកទស្សនា។ ឧបករណ៍ទាំងនេះនឹងបិទរហូតដល់អ្នកយល់ព្រម។',
            reject: 'បដិសេធ',
            accept: 'យល់ព្រម',
            policy: 'គោលការណ៍ឯកជនភាព',
            choices: 'ជម្រើសឯកជនភាព',
            close: 'បិទ និងបដិសេធ'
        },
        kn: {
            title: 'ಗೌಪ್ಯತೆ',
            message: 'ನಿಮ್ಮ ಅನುಮತಿಯೊಂದಿಗೆ ಅಭಿಯಾನದ ಫಲಿತಾಂಶಗಳನ್ನು ಅಳೆಯಲು ಮತ್ತು ಪ್ರೇಕ್ಷಕರ ವಿಭಾಗಗಳನ್ನು ರಚಿಸಲು ಜಾಹೀರಾತು ಸಾಧನಗಳನ್ನು ಬಳಸುತ್ತೇವೆ. ನೀವು ಒಪ್ಪುವವರೆಗೆ ಅವು ಆಫ್ ಆಗಿರುತ್ತವೆ.',
            reject: 'ನಿರಾಕರಿಸಿ',
            accept: 'ಒಪ್ಪಿಕೊಳ್ಳಿ',
            policy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
            choices: 'ಗೌಪ್ಯತಾ ಆಯ್ಕೆಗಳು',
            close: 'ಮುಚ್ಚಿ ಮತ್ತು ನಿರಾಕರಿಸಿ'
        },
        mr: {
            title: 'गोपनीयता',
            message: 'तुमच्या परवानगीने आम्ही मोहिमेचे परिणाम मोजण्यासाठी आणि प्रेक्षक गट तयार करण्यासाठी जाहिरात साधने वापरतो. तुम्ही स्वीकारेपर्यंत ती बंद राहतात.',
            reject: 'नकार द्या',
            accept: 'स्वीकारा',
            policy: 'गोपनीयता धोरण',
            choices: 'गोपनीयता पर्याय',
            close: 'बंद करा आणि नकार द्या'
        },
        te: {
            title: 'గోప్యత',
            message: 'మీ అనుమతితో ప్రచార ఫలితాలను కొలవడానికి మరియు ప్రేక్షకుల విభాగాలను రూపొందించడానికి ప్రకటన సాధనాలను ఉపయోగిస్తాము. మీరు అంగీకరించే వరకు అవి ఆఫ్‌లో ఉంటాయి.',
            reject: 'తిరస్కరించండి',
            accept: 'అంగీకరించండి',
            policy: 'గోప్యతా విధానం',
            choices: 'గోప్యతా ఎంపికలు',
            close: 'మూసి తిరస్కరించండి'
        },
        nl: {
            title: 'Privacy',
            message: 'Met jouw toestemming gebruiken we advertentietools om campagneresultaten te meten en doelgroepsegmenten te maken. Ze blijven uit totdat je akkoord gaat.',
            reject: 'Weigeren',
            accept: 'Accepteren',
            policy: 'Privacybeleid',
            choices: 'Privacykeuzes',
            close: 'Sluiten en weigeren'
        },
        fi: {
            title: 'Tietosuoja',
            message: 'Luvallasi käytämme mainostyökaluja kampanjatulosten mittaamiseen ja yleisösegmenttien luomiseen. Ne pysyvät pois käytöstä, kunnes hyväksyt.',
            reject: 'Hylkää',
            accept: 'Hyväksy',
            policy: 'Tietosuojakäytäntö',
            choices: 'Tietosuojavalinnat',
            close: 'Sulje ja hylkää'
        },
        cs: {
            title: 'Soukromí',
            message: 'S vaším souhlasem používáme reklamní nástroje k měření výsledků kampaní a vytváření segmentů publika. Zůstávají vypnuté, dokud je nepřijmete.',
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
                script.src = 'https://www.redditstatic.com/ads/pixel.js?pixel_id=' + encodeURIComponent(PIXEL_ID);
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
            '#privacy-consent-banner{position:fixed;z-index:10000;left:14px;right:14px;bottom:14px;max-width:600px;margin:0 auto;padding:16px;background:#252527;color:#faf9f6;border:1px solid #3a3a3c;border-radius:14px;font-family:Nunito,system-ui,sans-serif;box-shadow:none}' +
            '#privacy-consent-banner h2{margin:0 32px 6px 0;font-size:1.05rem;line-height:1.25;color:#faf9f6}' +
            '#privacy-consent-banner p{margin:0 0 11px;font-size:.88rem;line-height:1.42;color:#d7d7dc}' +
            '#privacy-consent-banner a{color:#f08a5d;text-decoration:underline;text-underline-offset:2px}' +
            '.privacy-consent-actions{display:flex;gap:8px;flex-wrap:wrap}' +
            '.privacy-consent-button{min-width:108px;padding:8px 15px;border:1px solid #545458;border-radius:999px;font:700 .9rem Nunito,system-ui,sans-serif;cursor:pointer}' +
            '.privacy-consent-reject{background:#2c2c2e;color:#c7c7cc}' +
            '.privacy-consent-accept{border-color:#c65326;background:#c65326;color:#fff}' +
            '.privacy-consent-button:focus-visible,.privacy-consent-close:focus-visible{outline:3px solid #f08a5d;outline-offset:3px}' +
            '.privacy-consent-close{position:absolute;top:9px;right:9px;width:32px;height:32px;border:0;background:transparent;color:#faf9f6;font-size:22px;line-height:1;cursor:pointer}' +
            '@media(max-width:520px){#privacy-consent-banner{left:8px;right:8px;bottom:8px;padding:14px}.privacy-consent-actions{display:grid;grid-template-columns:1fr 1fr}.privacy-consent-button{min-width:0;width:100%;padding:9px 8px}}';
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
    }

    function start() {
        injectStyles();

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
