# The Hoot Nannie - High-Resolution Photo Sources

**Compiled:** 2026-03-12
**Purpose:** Replace 258x258 Yelp thumbnails with full-resolution images for professional website build.

---

## Quick Summary

| Source | Photos Found | Avg Size | Resolution | Status |
|--------|-------------|----------|------------|--------|
| Yelp (full-size /o.jpg) | 37 | 100-180KB | ~1000-1600px wide | All confirmed working |
| Restaurant Guru (img02) | 29 | 66-120KB | ~600-800px wide | All confirmed working |
| Restaurant Guru (img05/img3) | 2 | 299-331KB | 1200-1600px wide | Confirmed working |
| Uber Eats (hero) | 1 | 841KB | 2880px wide | Confirmed working |
| Restaurantji | 2 | 112-146KB | ~800px wide | Confirmed working |
| **TOTAL** | **71 unique images** | | | |

---

## HOW TO BATCH DOWNLOAD

Save this as `download-photos.sh` and run it from the `assets/originals/` directory:

```bash
# Create directories
mkdir -p hires/yelp hires/restaurant-guru hires/uber-eats hires/restaurantji

# Yelp full-size (change 258s.jpg or l.jpg or 348s.jpg to o.jpg)
# Example: curl -o hires/yelp/salad.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/VGxZIKJBSiUYggZLBcDHYg/o.jpg"
```

---

## SOURCE 1: YELP FULL-SIZE PHOTOS (37 images)

**URL Pattern:** Replace `/258s.jpg`, `/348s.jpg`, or `/l.jpg` with `/o.jpg` for original full-size.
**CDN:** `s3-media0.fl.yelpcdn.com`
**All verified working as of 2026-03-12.**

### Food Photos

| # | URL | Size | Description |
|---|-----|------|-------------|
| 1 | `https://s3-media0.fl.yelpcdn.com/bphoto/VGxZIKJBSiUYggZLBcDHYg/o.jpg` | 99KB | Salad ("The salad was delicious!") |
| 2 | `https://s3-media0.fl.yelpcdn.com/bphoto/cyoY5meoeFqhIThh921gEA/o.jpg` | 98KB | Steak with Mac and Cheese ("cooked perfectly") |
| 3 | `https://s3-media0.fl.yelpcdn.com/bphoto/bpQCrraLU93qpkNHBojHQQ/o.jpg` | 121KB | Burger and fries (hand holding hamburger) |
| 4 | `https://s3-media0.fl.yelpcdn.com/bphoto/DA7dS8IACfpC9-BQGo-lCA/o.jpg` | 138KB | **Dirty Sanchez Burger** with Mac and Cheese |
| 5 | `https://s3-media0.fl.yelpcdn.com/bphoto/SeDo6atGU7DERlW0FzlBoQ/o.jpg` | 115KB | Dirty Sandwich Burger |
| 6 | `https://s3-media0.fl.yelpcdn.com/bphoto/fAASBECeQK46OJlaoA0O0w/o.jpg` | 105KB | **Crispy Chicken Sandwich** with fries |
| 7 | `https://s3-media0.fl.yelpcdn.com/bphoto/W6Uq8T0-4ZHuSd2hi8G0jQ/o.jpg` | 112KB | **Big Samantha sandwich** with fries |
| 8 | `https://s3-media0.fl.yelpcdn.com/bphoto/uxes8BXnhuiu3XlpjNlAQw/o.jpg` | 77KB | Turkey sandwich (from review) |
| 9 | `https://s3-media0.fl.yelpcdn.com/bphoto/91VnrXXYgCm8MqC301SB1w/o.jpg` | 160KB | Chicken Tenders |
| 10 | `https://s3-media0.fl.yelpcdn.com/bphoto/qxdhJiXDOxvpPc6CfC6OYw/o.jpg` | 129KB | **Smoked Wings** |
| 11 | `https://s3-media0.fl.yelpcdn.com/bphoto/roXL4JjgKHstSrQwwtr_JA/o.jpg` | 98KB | **Pulled Pork Plate** |
| 12 | `https://s3-media0.fl.yelpcdn.com/bphoto/r2HajeQKayuZBlQBxEUNZg/o.jpg` | 182KB | Eggs Benedict with asparagus |
| 13 | `https://s3-media0.fl.yelpcdn.com/bphoto/SwYYE5S_Sv8K5blITEGxKw/o.jpg` | 123KB | Appetizer: fries, cheese, bbq pork, ranch |
| 14 | `https://s3-media0.fl.yelpcdn.com/bphoto/htwSArjhzLCfnCVBnf6BgA/o.jpg` | 149KB | Fries with bbq pork & cheese |
| 15 | `https://s3-media0.fl.yelpcdn.com/bphoto/MW0Kt5NcuRrQyd6_Lc4xpQ/o.jpg` | 143KB | Chicken Sandwich (famous) |
| 16 | `https://s3-media0.fl.yelpcdn.com/bphoto/GY6lZi3SnUduZIXMUbEXvw/o.jpg` | 175KB | Smashed Patriot Burger |
| 17 | `https://s3-media0.fl.yelpcdn.com/bphoto/FX1eGagqzUo2dlWf3dR9hA/o.jpg` | 155KB | Patriot burger with fries |
| 18 | `https://s3-media0.fl.yelpcdn.com/bphoto/xnK2uZKlgDjS6JUtXMe23w/o.jpg` | 105KB | Chicken Sandwich (another angle) |
| 19 | `https://s3-media0.fl.yelpcdn.com/bphoto/DU55W1pt-YxxCU4PI6H1CQ/o.jpg` | 95KB | Buffalo flavor wings |
| 20 | `https://s3-media0.fl.yelpcdn.com/bphoto/bga_qpb_YL-C69yor3QrrQ/o.jpg` | 150KB | Now that's a rack!!! (BBQ ribs) |

### Drinks

| # | URL | Size | Description |
|---|-----|------|-------------|
| 21 | `https://s3-media0.fl.yelpcdn.com/bphoto/uUWEPjqRycBncrbAJ1JiNA/o.jpg` | 43KB | Tequila Sunrise |
| 22 | `https://s3-media0.fl.yelpcdn.com/bphoto/Cxv2AR9cdj-5U_WwdiZ7xg/o.jpg` | 126KB | Watermelon craft margarita |

### Interior

| # | URL | Size | Description |
|---|-----|------|-------------|
| 23 | `https://s3-media0.fl.yelpcdn.com/bphoto/pS36UFaLlCj6Jo5JDANS5A/o.jpg` | 156KB | Interior shot |
| 24 | `https://s3-media0.fl.yelpcdn.com/bphoto/3MYYlm1OK0XOCmik2Sfxew/o.jpg` | 165KB | Interior of the restaurant |
| 25 | `https://s3-media0.fl.yelpcdn.com/bphoto/vKutBUTHhS8mgFCYIRufeA/o.jpg` | 132KB | Interior |
| 26 | `https://s3-media0.fl.yelpcdn.com/bphoto/4Ka1o_w2K-XYUxnyO7XSZQ/o.jpg` | 157KB | Interior |

### Exterior

| # | URL | Size | Description |
|---|-----|------|-------------|
| 27 | `https://s3-media0.fl.yelpcdn.com/bphoto/_hdvF1YX5Px3XlyWIHDPNg/o.jpg` | 169KB | Outside/exterior view |

### Menu Photos

| # | URL | Size | Description |
|---|-----|------|-------------|
| 28 | `https://s3-media0.fl.yelpcdn.com/bphoto/EJ-XoxdRdBvRGYT1cCsnNA/o.jpg` | 67KB | Menu |
| 29 | `https://s3-media0.fl.yelpcdn.com/bphoto/tmdJBRhh6VKKCfs4hfIiaw/o.jpg` | 76KB | Menu #1 |
| 30 | `https://s3-media0.fl.yelpcdn.com/bphoto/MdbbMQI2NWbIsQhcUYYCFw/o.jpg` | 144KB | Menu #2 / Nice!! |

### Unidentified (from scrape, need visual check)

| # | URL | Size | Description |
|---|-----|------|-------------|
| 31 | `https://s3-media0.fl.yelpcdn.com/bphoto/qEpflG1GQN7AOfwA_1BPqw/o.jpg` | 96KB | Unknown (from 258s thumbnail) |
| 32 | `https://s3-media0.fl.yelpcdn.com/bphoto/V4uOonwLvnnS70TzXFk7gQ/o.jpg` | 146KB | Unknown (from 258s thumbnail) |
| 33 | `https://s3-media0.fl.yelpcdn.com/bphoto/PlxnbuX-VGWOKIgzb6_Xcg/o.jpg` | 127KB | Unknown |
| 34 | `https://s3-media0.fl.yelpcdn.com/bphoto/uz0cn12eMmHut4Doz-ysQQ/o.jpg` | 121KB | Unknown |
| 35 | `https://s3-media0.fl.yelpcdn.com/bphoto/AgL15j0DYjeRShqNbAYwNA/o.jpg` | 129KB | Unknown |
| 36 | `https://s3-media0.fl.yelpcdn.com/bphoto/9Xd6t4T98sk8zw9TZSAH9w/o.jpg` | 159KB | Unknown |
| 37 | `https://s3-media0.fl.yelpcdn.com/bphoto/7dGi4iAj34w192F1N3RWOw/o.jpg` | 120KB | Unknown |

---

## SOURCE 2: RESTAURANT GURU (31 images)

**CDN:** `img02.restaurantguru.com` (standard), `img05.restaurantguru.com` and `img3.restaurantguru.com` (high-res)
**Filenames are descriptive** - you can tell what each photo shows from the URL.
**All verified working as of 2026-03-12.**

### HIGH-RES (Largest available, 299-331KB)

| # | URL | Size | Description |
|---|-----|------|-------------|
| 1 | `https://img05.restaurantguru.com/r53a-The-Hoot-Nannie-interior-2025-08-1.jpg` | **331KB** | Interior (1200x1600 per metadata) |
| 2 | `https://img3.restaurantguru.com/rbf6-design-The-Hoot-Nannie-2025-08-5.jpg` | **299KB** | Design/ambiance shot |

### Food Photos (66-120KB each)

| # | URL | Size | Description |
|---|-----|------|-------------|
| 3 | `https://img02.restaurantguru.com/c7a0-Restaurant-The-Hoot-Nannie-filet-mignon.jpg` | 98KB | **Filet mignon** |
| 4 | `https://img02.restaurantguru.com/c4e1-Restaurant-The-Hoot-Nannie-burger.jpg` | 87KB | **Burger** |
| 5 | `https://img02.restaurantguru.com/cdaf-The-Hoot-Nannie-Forest-City-burger.jpg` | 120KB | **Burger** (different shot) |
| 6 | `https://img02.restaurantguru.com/ccae-Restaurant-The-Hoot-Nannie-steak.jpg` | 87KB | **Steak** |
| 7 | `https://img02.restaurantguru.com/cc85-Restaurant-The-Hoot-Nannie-prime-rib.jpg` | 74KB | **Prime rib** |
| 8 | `https://img02.restaurantguru.com/cc0e-Restaurant-The-Hoot-Nannie-chicken-wings.jpg` | 75KB | **Chicken wings** |
| 9 | `https://img02.restaurantguru.com/ce0f-The-Hoot-Nannie-Forest-City-chicken-wings.jpg` | 81KB | **Chicken wings** (different shot) |
| 10 | `https://img02.restaurantguru.com/c66c-Restaurant-The-Hoot-Nannie-pulled-pork-sandwich.jpg` | 77KB | **Pulled pork sandwich** |
| 11 | `https://img02.restaurantguru.com/c859-Restaurant-The-Hoot-Nannie-club-sandwich.jpg` | 86KB | **Club sandwich** |
| 12 | `https://img02.restaurantguru.com/ce26-Restaurant-The-Hoot-Nannie-fish-and-chips.jpg` | 98KB | **Fish and chips** |
| 13 | `https://img02.restaurantguru.com/cbb2-Restaurant-The-Hoot-Nannie-dumplings.jpg` | 77KB | **Dumplings** |
| 14 | `https://img02.restaurantguru.com/c530-Restaurant-The-Hoot-Nannie-french-fries.jpg` | 70KB | French fries |
| 15 | `https://img02.restaurantguru.com/cfcb-The-Hoot-Nannie-Forest-City-french-fries.jpg` | 77KB | French fries (different shot) |
| 16 | `https://img02.restaurantguru.com/c992-The-Hoot-Nannie-Forest-City-food.jpg` | 111KB | Food (generic) |
| 17 | `https://img02.restaurantguru.com/cae2-Restaurant-The-Hoot-Nannie-food.jpg` | 67KB | Food (generic) |
| 18 | `https://img02.restaurantguru.com/c55a-The-Hoot-Nannie-Forest-City-meals.jpg` | 100KB | Meals |
| 19 | `https://img02.restaurantguru.com/cece-Restaurant-The-Hoot-Nannie-meals.jpg` | 88KB | Meals |
| 20 | `https://img02.restaurantguru.com/ceca-The-Hoot-Nannie-Forest-City-dishes.jpg` | 73KB | Dishes |
| 21 | `https://img02.restaurantguru.com/cfac-Restaurant-The-Hoot-Nannie-dishes.jpg` | 82KB | Dishes |

### Drinks

| # | URL | Size | Description |
|---|-----|------|-------------|
| 22 | `https://img02.restaurantguru.com/c485-Restaurant-The-Hoot-Nannie-drink.jpg` | 66KB | Drink |

### Interior

| # | URL | Size | Description |
|---|-----|------|-------------|
| 23 | `https://img02.restaurantguru.com/c78e-Restaurant-The-Hoot-Nannie-interior.jpg` | 82KB | Interior |
| 24 | `https://img02.restaurantguru.com/c0f3-Restaurant-The-Hoot-Nannie-interior-1.jpg` | 103KB | Interior (second shot) |
| 25 | `https://img02.restaurantguru.com/caff-The-Hoot-Nannie-Forest-City-interior.jpg` | 72KB | Interior |

### Exterior / Storefront

| # | URL | Size | Description |
|---|-----|------|-------------|
| 26 | `https://img02.restaurantguru.com/c184-Restaurant-The-Hoot-Nannie-exterior.jpg` | 88KB | **Exterior** |
| 27 | `https://img02.restaurantguru.com/c86d-Restaurant-The-Hoot-Nannie-facade.jpg` | 112KB | **Facade/storefront** |
| 28 | `https://img02.restaurantguru.com/ca4b-The-Hoot-Nannie-Forest-City-view.jpg` | 80KB | View of restaurant |

### Design / Ambiance

| # | URL | Size | Description |
|---|-----|------|-------------|
| 29 | `https://img02.restaurantguru.com/c3f5-Restaurant-The-Hoot-Nannie-design.jpg` | 82KB | Design/decor |
| 30 | `https://img02.restaurantguru.com/c70a-The-Hoot-Nannie-Forest-City-design.jpg` | 102KB | Design/decor |
| 31 | `https://img02.restaurantguru.com/c3b2-The-Hoot-Nannie-Forest-City-photo.jpg` | 67KB | General photo |

---

## SOURCE 3: UBER EATS (1 image, but HUGE)

**The store only has one hero image, but it comes in multiple sizes up to 2880px wide.**

| # | URL | Size | Width | Description |
|---|-----|------|-------|-------------|
| 1 | `https://tb-static.uber.com/prod/image-proc/processed_images/8cc87a89df573fccad81563eebb202fc/fb86662148be855d931b37d6c1e5fcbe.jpeg` | **841KB** | **2880px** | Store hero image (best resolution available anywhere) |
| 2 | `https://tb-static.uber.com/prod/image-proc/processed_images/8cc87a89df573fccad81563eebb202fc/783282f6131ef2258e5bcd87c46aa87e.jpeg` | 183KB | 1080px | Same image, 1080px version |
| 3 | `https://tb-static.uber.com/prod/image-proc/processed_images/8cc87a89df573fccad81563eebb202fc/8a42ee7a692dfa4155879820804a277f.jpeg` | - | 750px | Same image, 750px version |

---

## SOURCE 4: RESTAURANTJI (2 images)

| # | URL | Size | Description |
|---|-----|------|-------------|
| 1 | `https://cdn6.localdatacdn.com/images/6374911/d_the_hoot_nannie_photo.jpg?q=69b0309add38f` | 146KB | Restaurant photo (d_ prefix = display/large) |
| 2 | `https://cdn6.localdatacdn.com/images/6374911/d_the_hoot_nannie_menu.jpg?q=69b0309add397` | 185KB | Menu photo |

---

## PRIORITY DOWNLOAD LIST (Best photos for website, by category)

### Must-Have: Food (biggest/best quality)

1. **Dirty Sanchez Burger**: `https://s3-media0.fl.yelpcdn.com/bphoto/DA7dS8IACfpC9-BQGo-lCA/o.jpg` (138KB)
2. **Steak**: `https://s3-media0.fl.yelpcdn.com/bphoto/cyoY5meoeFqhIThh921gEA/o.jpg` (98KB) + `https://img02.restaurantguru.com/ccae-Restaurant-The-Hoot-Nannie-steak.jpg` (87KB)
3. **Prime Rib**: `https://img02.restaurantguru.com/cc85-Restaurant-The-Hoot-Nannie-prime-rib.jpg` (74KB)
4. **Filet Mignon**: `https://img02.restaurantguru.com/c7a0-Restaurant-The-Hoot-Nannie-filet-mignon.jpg` (98KB)
5. **BBQ Ribs**: `https://s3-media0.fl.yelpcdn.com/bphoto/bga_qpb_YL-C69yor3QrrQ/o.jpg` (150KB)
6. **Pulled Pork**: `https://s3-media0.fl.yelpcdn.com/bphoto/roXL4JjgKHstSrQwwtr_JA/o.jpg` (98KB) + `https://img02.restaurantguru.com/c66c-Restaurant-The-Hoot-Nannie-pulled-pork-sandwich.jpg` (77KB)
7. **Wings**: `https://s3-media0.fl.yelpcdn.com/bphoto/qxdhJiXDOxvpPc6CfC6OYw/o.jpg` (129KB) + `https://img02.restaurantguru.com/cc0e-Restaurant-The-Hoot-Nannie-chicken-wings.jpg` (75KB)
8. **Chicken Sandwich**: `https://s3-media0.fl.yelpcdn.com/bphoto/fAASBECeQK46OJlaoA0O0w/o.jpg` (105KB)
9. **Big Samantha**: `https://s3-media0.fl.yelpcdn.com/bphoto/W6Uq8T0-4ZHuSd2hi8G0jQ/o.jpg` (112KB)
10. **Eggs Benedict**: `https://s3-media0.fl.yelpcdn.com/bphoto/r2HajeQKayuZBlQBxEUNZg/o.jpg` (182KB)
11. **Patriot Burger**: `https://s3-media0.fl.yelpcdn.com/bphoto/GY6lZi3SnUduZIXMUbEXvw/o.jpg` (175KB)
12. **Fish and Chips**: `https://img02.restaurantguru.com/ce26-Restaurant-The-Hoot-Nannie-fish-and-chips.jpg` (98KB)
13. **BBQ Fries/Loaded**: `https://s3-media0.fl.yelpcdn.com/bphoto/htwSArjhzLCfnCVBnf6BgA/o.jpg` (149KB)

### Must-Have: Drinks

14. **Watermelon Margarita**: `https://s3-media0.fl.yelpcdn.com/bphoto/Cxv2AR9cdj-5U_WwdiZ7xg/o.jpg` (126KB)
15. **Tequila Sunrise**: `https://s3-media0.fl.yelpcdn.com/bphoto/uUWEPjqRycBncrbAJ1JiNA/o.jpg` (43KB)
16. **General Drink**: `https://img02.restaurantguru.com/c485-Restaurant-The-Hoot-Nannie-drink.jpg` (66KB)

### Must-Have: Interior

17. **HIGH-RES Interior**: `https://img05.restaurantguru.com/r53a-The-Hoot-Nannie-interior-2025-08-1.jpg` (331KB, 1200x1600)
18. **Interior**: `https://s3-media0.fl.yelpcdn.com/bphoto/pS36UFaLlCj6Jo5JDANS5A/o.jpg` (156KB)
19. **Interior**: `https://s3-media0.fl.yelpcdn.com/bphoto/3MYYlm1OK0XOCmik2Sfxew/o.jpg` (165KB)

### Must-Have: Exterior/Storefront

20. **Facade**: `https://img02.restaurantguru.com/c86d-Restaurant-The-Hoot-Nannie-facade.jpg` (112KB)
21. **Exterior**: `https://img02.restaurantguru.com/c184-Restaurant-The-Hoot-Nannie-exterior.jpg` (88KB)
22. **Storefront from Yelp**: `https://s3-media0.fl.yelpcdn.com/bphoto/_hdvF1YX5Px3XlyWIHDPNg/o.jpg` (169KB)

### Hero Image (Uber Eats, 2880px)

23. **Store Hero**: `https://tb-static.uber.com/prod/image-proc/processed_images/8cc87a89df573fccad81563eebb202fc/fb86662148be855d931b37d6c1e5fcbe.jpeg` (841KB, 2880px wide)

---

## DOWNLOAD SCRIPT

Copy-paste this into Git Bash from the `hoot-nannie/assets/` directory:

```bash
mkdir -p hires

# === TOP PRIORITY: Uber Eats hero (2880px) ===
curl -o hires/uber-hero-2880.jpg "https://tb-static.uber.com/prod/image-proc/processed_images/8cc87a89df573fccad81563eebb202fc/fb86662148be855d931b37d6c1e5fcbe.jpeg"

# === Restaurant Guru HIGH-RES ===
curl -o hires/rg-interior-highres.jpg "https://img05.restaurantguru.com/r53a-The-Hoot-Nannie-interior-2025-08-1.jpg"
curl -o hires/rg-design-highres.jpg "https://img3.restaurantguru.com/rbf6-design-The-Hoot-Nannie-2025-08-5.jpg"

# === Yelp Full-Size (/o.jpg originals) ===
curl -o hires/yelp-salad.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/VGxZIKJBSiUYggZLBcDHYg/o.jpg"
curl -o hires/yelp-steak-mac.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/cyoY5meoeFqhIThh921gEA/o.jpg"
curl -o hires/yelp-burger-hand.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/bpQCrraLU93qpkNHBojHQQ/o.jpg"
curl -o hires/yelp-dirty-sanchez.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/DA7dS8IACfpC9-BQGo-lCA/o.jpg"
curl -o hires/yelp-dirty-sandwich.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/SeDo6atGU7DERlW0FzlBoQ/o.jpg"
curl -o hires/yelp-crispy-chicken.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/fAASBECeQK46OJlaoA0O0w/o.jpg"
curl -o hires/yelp-big-samantha.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/W6Uq8T0-4ZHuSd2hi8G0jQ/o.jpg"
curl -o hires/yelp-turkey-sandwich.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/uxes8BXnhuiu3XlpjNlAQw/o.jpg"
curl -o hires/yelp-chicken-tenders.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/91VnrXXYgCm8MqC301SB1w/o.jpg"
curl -o hires/yelp-smoked-wings.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/qxdhJiXDOxvpPc6CfC6OYw/o.jpg"
curl -o hires/yelp-pulled-pork.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/roXL4JjgKHstSrQwwtr_JA/o.jpg"
curl -o hires/yelp-eggs-benedict.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/r2HajeQKayuZBlQBxEUNZg/o.jpg"
curl -o hires/yelp-loaded-fries.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/SwYYE5S_Sv8K5blITEGxKw/o.jpg"
curl -o hires/yelp-bbq-fries.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/htwSArjhzLCfnCVBnf6BgA/o.jpg"
curl -o hires/yelp-chicken-sandwich-famous.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/MW0Kt5NcuRrQyd6_Lc4xpQ/o.jpg"
curl -o hires/yelp-patriot-burger.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/GY6lZi3SnUduZIXMUbEXvw/o.jpg"
curl -o hires/yelp-patriot-fries.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/FX1eGagqzUo2dlWf3dR9hA/o.jpg"
curl -o hires/yelp-chicken-sandwich2.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/xnK2uZKlgDjS6JUtXMe23w/o.jpg"
curl -o hires/yelp-buffalo-wings.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/DU55W1pt-YxxCU4PI6H1CQ/o.jpg"
curl -o hires/yelp-ribs.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/bga_qpb_YL-C69yor3QrrQ/o.jpg"
curl -o hires/yelp-tequila-sunrise.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/uUWEPjqRycBncrbAJ1JiNA/o.jpg"
curl -o hires/yelp-watermelon-margarita.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/Cxv2AR9cdj-5U_WwdiZ7xg/o.jpg"
curl -o hires/yelp-interior1.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/pS36UFaLlCj6Jo5JDANS5A/o.jpg"
curl -o hires/yelp-interior2.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/3MYYlm1OK0XOCmik2Sfxew/o.jpg"
curl -o hires/yelp-interior3.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/vKutBUTHhS8mgFCYIRufeA/o.jpg"
curl -o hires/yelp-interior4.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/4Ka1o_w2K-XYUxnyO7XSZQ/o.jpg"
curl -o hires/yelp-exterior.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/_hdvF1YX5Px3XlyWIHDPNg/o.jpg"
curl -o hires/yelp-unknown1.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/qEpflG1GQN7AOfwA_1BPqw/o.jpg"
curl -o hires/yelp-unknown2.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/V4uOonwLvnnS70TzXFk7gQ/o.jpg"
curl -o hires/yelp-unknown3.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/PlxnbuX-VGWOKIgzb6_Xcg/o.jpg"
curl -o hires/yelp-unknown4.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/uz0cn12eMmHut4Doz-ysQQ/o.jpg"
curl -o hires/yelp-unknown5.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/AgL15j0DYjeRShqNbAYwNA/o.jpg"
curl -o hires/yelp-unknown6.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/9Xd6t4T98sk8zw9TZSAH9w/o.jpg"
curl -o hires/yelp-unknown7.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/7dGi4iAj34w192F1N3RWOw/o.jpg"
curl -o hires/yelp-menu1.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/EJ-XoxdRdBvRGYT1cCsnNA/o.jpg"
curl -o hires/yelp-menu2.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/tmdJBRhh6VKKCfs4hfIiaw/o.jpg"
curl -o hires/yelp-menu3.jpg "https://s3-media0.fl.yelpcdn.com/bphoto/MdbbMQI2NWbIsQhcUYYCFw/o.jpg"

# === Restaurant Guru Standard Photos ===
curl -o hires/rg-filet-mignon.jpg "https://img02.restaurantguru.com/c7a0-Restaurant-The-Hoot-Nannie-filet-mignon.jpg"
curl -o hires/rg-burger.jpg "https://img02.restaurantguru.com/c4e1-Restaurant-The-Hoot-Nannie-burger.jpg"
curl -o hires/rg-burger2.jpg "https://img02.restaurantguru.com/cdaf-The-Hoot-Nannie-Forest-City-burger.jpg"
curl -o hires/rg-steak.jpg "https://img02.restaurantguru.com/ccae-Restaurant-The-Hoot-Nannie-steak.jpg"
curl -o hires/rg-prime-rib.jpg "https://img02.restaurantguru.com/cc85-Restaurant-The-Hoot-Nannie-prime-rib.jpg"
curl -o hires/rg-wings.jpg "https://img02.restaurantguru.com/cc0e-Restaurant-The-Hoot-Nannie-chicken-wings.jpg"
curl -o hires/rg-wings2.jpg "https://img02.restaurantguru.com/ce0f-The-Hoot-Nannie-Forest-City-chicken-wings.jpg"
curl -o hires/rg-pulled-pork.jpg "https://img02.restaurantguru.com/c66c-Restaurant-The-Hoot-Nannie-pulled-pork-sandwich.jpg"
curl -o hires/rg-club-sandwich.jpg "https://img02.restaurantguru.com/c859-Restaurant-The-Hoot-Nannie-club-sandwich.jpg"
curl -o hires/rg-fish-chips.jpg "https://img02.restaurantguru.com/ce26-Restaurant-The-Hoot-Nannie-fish-and-chips.jpg"
curl -o hires/rg-dumplings.jpg "https://img02.restaurantguru.com/cbb2-Restaurant-The-Hoot-Nannie-dumplings.jpg"
curl -o hires/rg-fries.jpg "https://img02.restaurantguru.com/c530-Restaurant-The-Hoot-Nannie-french-fries.jpg"
curl -o hires/rg-fries2.jpg "https://img02.restaurantguru.com/cfcb-The-Hoot-Nannie-Forest-City-french-fries.jpg"
curl -o hires/rg-food.jpg "https://img02.restaurantguru.com/c992-The-Hoot-Nannie-Forest-City-food.jpg"
curl -o hires/rg-food2.jpg "https://img02.restaurantguru.com/cae2-Restaurant-The-Hoot-Nannie-food.jpg"
curl -o hires/rg-meals.jpg "https://img02.restaurantguru.com/c55a-The-Hoot-Nannie-Forest-City-meals.jpg"
curl -o hires/rg-meals2.jpg "https://img02.restaurantguru.com/cece-Restaurant-The-Hoot-Nannie-meals.jpg"
curl -o hires/rg-dishes.jpg "https://img02.restaurantguru.com/ceca-The-Hoot-Nannie-Forest-City-dishes.jpg"
curl -o hires/rg-dishes2.jpg "https://img02.restaurantguru.com/cfac-Restaurant-The-Hoot-Nannie-dishes.jpg"
curl -o hires/rg-drink.jpg "https://img02.restaurantguru.com/c485-Restaurant-The-Hoot-Nannie-drink.jpg"
curl -o hires/rg-interior.jpg "https://img02.restaurantguru.com/c78e-Restaurant-The-Hoot-Nannie-interior.jpg"
curl -o hires/rg-interior2.jpg "https://img02.restaurantguru.com/c0f3-Restaurant-The-Hoot-Nannie-interior-1.jpg"
curl -o hires/rg-interior3.jpg "https://img02.restaurantguru.com/caff-The-Hoot-Nannie-Forest-City-interior.jpg"
curl -o hires/rg-exterior.jpg "https://img02.restaurantguru.com/c184-Restaurant-The-Hoot-Nannie-exterior.jpg"
curl -o hires/rg-facade.jpg "https://img02.restaurantguru.com/c86d-Restaurant-The-Hoot-Nannie-facade.jpg"
curl -o hires/rg-view.jpg "https://img02.restaurantguru.com/ca4b-The-Hoot-Nannie-Forest-City-view.jpg"
curl -o hires/rg-design.jpg "https://img02.restaurantguru.com/c3f5-Restaurant-The-Hoot-Nannie-design.jpg"
curl -o hires/rg-design2.jpg "https://img02.restaurantguru.com/c70a-The-Hoot-Nannie-Forest-City-design.jpg"
curl -o hires/rg-photo.jpg "https://img02.restaurantguru.com/c3b2-The-Hoot-Nannie-Forest-City-photo.jpg"

# === Restaurantji ===
curl -o hires/rji-photo.jpg "https://cdn6.localdatacdn.com/images/6374911/d_the_hoot_nannie_photo.jpg?q=69b0309add38f"
curl -o hires/rji-menu.jpg "https://cdn6.localdatacdn.com/images/6374911/d_the_hoot_nannie_menu.jpg?q=69b0309add397"

echo "Download complete! Check hires/ directory."
```

---

## NOTES

- **Yelp URL trick:** Any Yelp bphoto URL can be converted to full resolution by changing the suffix to `/o.jpg`. The `258s.jpg` = 258px square thumbnail, `348s.jpg` = 348px square, `l.jpg` = "large" (~533px), `o.jpg` = original (typically 1000-1600px).
- **Restaurant Guru** has 170 photos total but only ~30 are accessible without JavaScript rendering. The img02 domain serves standard resolution, img05 serves high-res originals.
- **Uber Eats** hero image at 2880px is the single largest image found for this restaurant. It's likely the same image the restaurant submitted as their main photo.
- **Duplicate coverage:** Many photos appear on multiple platforms (same original uploaded to Yelp + Google + Restaurant Guru). After downloading, do a visual dedup pass.
- **Missing from search:** Cheese curds, Cuban sandwich, shrimp and grits, bourbon/cocktail close-ups. These may exist in the 140+ Restaurant Guru photos that require JavaScript to load. Try visiting https://restaurantguru.com/The-Hoot-Nannie-Forest-City in a browser and scrolling through the photo gallery to find them.
