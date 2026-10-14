# Raporlar

![usable pairs](rozet.svg)

Gölge kolunun **oran taşıyabilen** çift sayısı, hedef 20. Bu sayı hedefe ulaşınca manşet izdüşüm olmaktan çıkıp doğrudan ölçüme dayanabilir — dolana kadar `lea.js` değişmiyor.

Bütün ölçümler tek sayfada. **2026-10-14 03:36** tarihinde `savings.py` tarafından üretildi —
elle düzenlenmiyor.

> Bu sayfa GitHub'da açılır çünkü Markdown. Yanındaki `.html` raporlar açılmaz: GitHub HTML'i
> kaynak olarak gösterir, ve private depoda Pages bu planda reddediliyor (HTTP 422). Onları
> okumak için `pwsh -File site/ac.ps1` — çeker ve tarayıcıda açar.

## Lea ne kazandırdı

| | |
|---|---|
| **Tasarruf** | **$1,123 · −26%** |
| Ölçülen kullanım (API fiyatıyla değerlenmiş) | $3,127.04 · 370 istem · 11,497 tur |
| Aynı iş `full` config'iyle | $4,250 |
| Üst sınır (en iyi ölçülen tur) | $3,305 · −51% |
| Bunu kanıtlamanın maliyeti | $35.65 · 44 gölge koşusu |

Manşet **alt sınır**: dört ölçülmüş turun Lea'ya en az kazandıranını kullanıyor
(Kolay bug fix, n=3/3). Ölçülmüş oran × ölçülmüş harcama — doğrudan ölçülmüş tasarruf
değil. Onu ölçecek olan gölge kolu.

## Ölçülen oranlar (Opus, `full` karşısında)

| tur | Lea USD | full USD | oran | kesinti | n |
|---|---|---|---|---|---|
| Metin (araç yok) | 0.2032 | 0.4180 | 0.486 | −51.4% | 5 / 3 |
| Gerçek proje turu | 3.7349 | 5.5595 | 0.672 | −32.8% | 3 / 3 |
| Zor bug fix | 0.2058 | 0.2923 | 0.704 | −29.6% | 5 / 5 |
| Kolay bug fix | 0.1842 | 0.2503 | 0.736 | −26.4% | 3 / 3 |

## Gerçek işin maliyeti nereye gidiyor

| kalem | token | pay |
|---|---|---|
| cache okuma (konuşmayı yeniden okumak) | 4,261,561,279 | %68 |
| girdi + cache yazma | 56,934,498 | %18 |
| çıktı | 17,227,396 | %14 |

Paranın üçte ikisi konuşmayı yeniden okumaya gidiyor, çıktıya değil. Lea'nın 120 kelimelik
bütçesinin doğrudan kestiği kalem en küçüğü — asıl kaldıraç **tur sayısı**.

## Hangi kurulum ne kadarını yazdı

| kurulum | istem | USD |
|---|---|---|
| `A` | 314 | $2,782.20 |
| `B` | 57 | $344.85 |

## Gölge kolu

| | |
|---|---|
| kayıtlı istem | 1166 |
| koşan | 44 |
| kullanılan kota (API fiyatıyla) | $35.65 |
| karşılaştırılabilir çift | 5 |
| **oran taşıyabilen çift** | **1 / 20** |

Alttaki satır ilerlemeyi gösteren tek sayı. Üstteki "aynı istem iki kola soruldu" demek;
alttaki "ve iki kol karşılaştırılabilir miktarda iş yaptı" demek. Manşetin izdüşümden ölçüme
geçmesi alttakine bağlı.

## Karşılaştırılabilir çiftler

Aynı istem, iki kol, aynı ağaçtan.

| tarih | kaynak | config | tur L/S | çıktı L/S | taşınan girdi L/S | değişen dosya L/S |
|---|---|---|---|---|---|---|
| 2026-09-02 21:24 | local | bare | 23 / 13 | 19k / 6k | 1.3M / 251k | ? / 0 |
| 2026-09-03 06:52 | local | bare | 4 / 4 | 527 / 1k | 161k / 90k | ? / 0 |
| 2026-09-03 08:05 | local | bare | 57 / 25 | 81k / 25k | 5.0M / 1.0M | ? / 1 |
| 2026-09-04 10:58 | local | bare | 28 / 9 | 32k / 5k | 1.3M / 159k | 1942 / 0 |
| 2026-10-07 16:14 | local | modes | 1 / 1 | 134 / 163 | 62k / 24k | 0 / 0 |

**Bu çiftlerden 4 tanesi oran taşıyamaz.** Son sütun sebebi: bir kol iş yaptı, diğeri yapmadı — ya da sayı hiç kaydedilmedi. Az iş yapmak her zaman ucuzdur, o yüzden bu satırlar gösteriliyor ama ortalamaya girmiyor. Gölge kolunun 2026-09-03'e kadarki bütün çiftlerinde Lea tarafının diff'i kayıp: `git diff` proje kökünü tararken `shadow/runs/` içindeki eski kopyalara giriyor, bir yol Windows sınırını geçiyor ve komut hiçbir şey yazmadan çıkıyordu. Düzeltildi; bundan sonraki çiftlerde bu sütun dolu gelecek.


## v9 denendi, geçemedi

| kol | n=40 | oran |
|---|---|---|
| `lea-v8` aynı gün kontrolü | 32/40 | 0.80 |
| `lea-v9c` aday | 36/40 | 0.90 |

İki yanlı Fisher **p = 0.3482**; bu kontrol için baraj **39/40** idi ve tur koşmadan *önce* yazılmıştı. **v9 yok** — `lea.js` değişmedi. 92 hücre, $9.23, 0 hata.

Turun asıl bulgusu aday değil: v9 fikrini doğuran **13/20** bir oran değil, düşük bir çekilişti. Aynı bayt-aynı config üç blokta 13/20, 15/20, 17/20 aldı — havuzda **45/60 = 0.75**. Aday *tarihsel* 13/20'ye karşı ölçülseydi p = 0.0315 ile "kazandı" diye okunurdu; aynı gün koşan kontrole karşı p = 0.3482. Aradaki fark kolun değil, günün farkıydı.

Maliyet oranı: hard 1.056, düzyazı 1.041 (kol başına n=6, yalnız ~%35 üstü bir bozulmayı görebilir).

## Tam raporlar

Aşağıdakiler HTML; GitHub'da kaynak olarak görünürler. `pwsh -File site/ac.ps1` hepsini çeker
ve tarayıcıda açar.

| dosya | ne anlatıyor |
|---|---|
| [`index.html`](index.html) | çerçeve — banner ve diğerlerine bağlantılar |
| [`rapor-lea.html`](rapor-lea.html) | Lea'nın kendisi, kuralları, v7'ye karşı v8 |
| [`rapor.html`](rapor.html) | dört benchmark turu, beş config, Sonnet |
| [`rapor-model-karsilastirma.html`](rapor-model-karsilastirma.html) | aynı turlar Sonnet ve Opus yan yana |
| [`rapor-opus-proje-turu.html`](rapor-opus-proje-turu.html) | gerçek depo turu, Opus |
| [`rapor-tasarruf.html`](rapor-tasarruf.html) | tasarruf hesabının tamamı |
| [`rapor-golge.html`](rapor-golge.html) | gölge kolunun durumu ve verimi ne kilitliyor |
| [`rapor-v9.html`](rapor-v9.html) | v9 turu: aday, aynı gün kontrolü, ve neden geçemedi |
| [`savings.json`](savings.json) | manşetin arkasındaki her ara değer |

Sayfalarda kullanıcı adı, makine adı ve hesap adı içeren mutlak yol **yok**; kurulumlar
`A` / `B` hesap etiketiyle görünüyor. `check_docs.py`'nin `leak` geçişi bunu her koşuda
doğruluyor.
