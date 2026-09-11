// =========================================================================
// AI PROMPTS CURATED SHOWCASE DATASET
// 12 Curated, 100% Unique, Production-Verified Transformations
// Zero repeated images | Zero fake cards
// =========================================================================

const AI_PROMPTS_CATEGORIES = [
  {
    "id": "all",
    "name": "All Transformations",
    "icon": "\u2728",
    "count": 12
  },
  {
    "id": "retro_y2k",
    "name": "Y2K & Vintage",
    "icon": "\ud83d\udcfc",
    "count": 2
  },
  {
    "id": "cinematic",
    "name": "Cinematic Film",
    "icon": "\ud83c\udfac",
    "count": 3
  },
  {
    "id": "art_anime",
    "name": "Art & Anime",
    "icon": "\ud83c\udfa8",
    "count": 2
  },
  {
    "id": "toys",
    "name": "Toys & Miniatures",
    "icon": "\ud83e\uddf8",
    "count": 3
  },
  {
    "id": "fashion",
    "name": "Fashion & Beauty",
    "icon": "\ud83d\udc60",
    "count": 2
  }
];

const AI_PROMPTS_DATA = [
  {
    "id": "y2k-01",
    "title": "1998 Disposable Camera Flash Snapshot",
    "category": "retro_y2k",
    "category_name": "Y2K Retro",
    "badge": "\ud83d\udd25 Viral",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_02_y2k_flash.jpg",
    "short_description": "Harsh direct xenon flash, overexposed highlights, heavy 35mm optical grain, and orange '98 11 14 digital date stamp.",
    "prompt": "Authentic 1998 disposable camera snapshot taken in the late 90s. Harsh direct on-camera xenon flash, overexposed highlights on forehead and nose, heavy optical film grain, slight red-eye reflection in pupils, vibrant saturated colors, authentic faded color chemistry of Fujifilm QuickSnap disposable, bright orange digital date stamp reading '98 11 14 in the lower right corner, genuine candid imperfect nostalgic snapshot.",
    "dna": {
      "subject": "Everyday casual cafe portrait",
      "lighting": "Harsh direct on-camera xenon flash",
      "camera": "Fujifilm QuickSnap single-use disposable",
      "texture": "Heavy 35mm optical grain & emulsion halation",
      "color": "Warm saturated 90s film dyes with cyan shadow shift",
      "mood": "Nostalgic, uncurated, chaotic late-night fun"
    },
    "why_it_works": "Direct on-camera flash creates high-contrast edge falloff while specifying exact film stock chemistry anchors authentic color dyes.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 4
    },
    "tags": [
      "y2k",
      "disposable",
      "90s",
      "flash",
      "grain",
      "nostalgia",
      "candid"
    ]
  },
  {
    "id": "cine-01",
    "title": "1940s Classic Hollywood Film Noir",
    "category": "cinematic",
    "category_name": "Film Noir",
    "badge": "\ud83d\udc10 Goated",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_01_film_noir.jpg",
    "short_description": "Dramatic Venetian blind shadows cutting diagonally across face, volumetric cigarette smoke beams, Kodak Tri-X 35mm grain.",
    "prompt": "1940s classic Hollywood Film Noir cinema still. Dramatic high-contrast black and white chiaroscuro lighting, razor-sharp Venetian blind shadows cutting diagonally across the subject's face, hazy cigarette smoke hanging in atmospheric volumetric light beams, rain droplets running down window glass in background, 35mm black and white Kodak Tri-X film grain, moody melancholic detective thriller atmosphere.",
    "dna": {
      "subject": "Everyday casual cafe portrait",
      "lighting": "High-contrast chiaroscuro with Venetian blind shadows",
      "camera": "1940s 35mm Mitchell BNC cinema camera",
      "texture": "Silver-halide Kodak Tri-X 400 monochrome grain",
      "color": "Pure monochromatic silver and deep graphite void",
      "mood": "Melancholic, dangerous, brooding mystery"
    },
    "why_it_works": "Tenebrism and diagonal shadow bars sculpt geometric volume across the face, eliminating modern digital flatness.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 5
    },
    "tags": [
      "film noir",
      "black and white",
      "vintage",
      "shadows",
      "cinematic",
      "1940s"
    ]
  },
  {
    "id": "art-01",
    "title": "Studio Ghibli Hand-Painted Anime Cel",
    "category": "art_anime",
    "category_name": "Ghibli Anime",
    "badge": "\ud83d\udd25 Viral",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_03_ghibli.jpg",
    "short_description": "Hayao Miyazaki hand-painted gouache watercolor, soft cel-shaded facial features, lush climbing ivy, fluffy cumulus clouds.",
    "prompt": "Hand-painted Studio Ghibli anime cel animation frame directed by Hayao Miyazaki. Soft gouache watercolor brushwork, cel-shaded facial features with warm friendly anime eyes and smile, lush green ivy plants climbing the cafe brick wall, giant fluffy cumulus anime clouds outside the window against cobalt blue sky, warm morning sunlight, whimsical peaceful Ghibli aesthetic, 90s classic Japanese anime movie look.",
    "dna": {
      "subject": "Everyday casual cafe portrait",
      "lighting": "Gentle golden morning sun with diffuse bounce",
      "camera": "Animation rostrum camera on physical multiplane cels",
      "texture": "Hand-painted gouache on layered celluloid",
      "color": "Vibrant cobalt blue, emerald green & warm peach",
      "mood": "Whimsical, nostalgic, heartwarming peace"
    },
    "why_it_works": "Specifying hand-painted gouache and multiplane cels forces the model to synthesize organic anime warmth rather than sterile vector lines.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 5,
      "SDXL 1.0": 4
    },
    "tags": [
      "ghibli",
      "anime",
      "watercolor",
      "miyazaki",
      "cel animation",
      "nostalgic"
    ]
  },
  {
    "id": "toy-01",
    "title": "1:12 Scale Action Figure in Blister Pack",
    "category": "toys",
    "category_name": "Toy Packaging",
    "badge": "\ud83d\udd25 Viral",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_04_action_figure.jpg",
    "short_description": "Mint-in-box plastic action figure with ball-joint elbows, printed cardback, transparent blister bubble, miniature coffee mug.",
    "prompt": "Mint-in-box 1:12 scale collectible action figure toy of the subject. Sealed inside transparent molded plastic blister packaging on a glossy printed cardboard cardback. The cardback header reads 'URBAN SERIES // CAFE SELFIE'. Plastic toy figure with visible ball-joint articulations at elbows and shoulders, molded painted plastic hair, miniature plastic smartphone accessory and miniature coffee mug accessory held in small plastic molded clips next to the figure. Highly detailed toy photography, plastic reflections on blister bubble, barcode and safety warning at bottom.",
    "dna": {
      "subject": "Molded PVC action figure of subject",
      "lighting": "Commercial toy packaging studio ring-light",
      "camera": "Canon EOS R5 with 100mm Macro f/2.8",
      "texture": "Molded polystyrene, glossy blister plastic & cardstock",
      "color": "Saturated toy palette with glossy sheen",
      "mood": "Nostalgic pop-culture collectible irony"
    },
    "why_it_works": "Describing the full packaging anatomy (blister bubble, cardboard cardback, molded accessories, barcode) activates physical product render tokens.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 4
    },
    "tags": [
      "action figure",
      "toy packaging",
      "blister pack",
      "collectible",
      "macro"
    ]
  },
  {
    "id": "fash-01",
    "title": "Vogue Avant-Garde Magazine Cover",
    "category": "fashion",
    "category_name": "High Fashion",
    "badge": "\ud83d\udcc8 Rising",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_05_vogue.jpg",
    "short_description": "Structured architectural black couture jacket, sleek wet-look editorial hair, defined cheekbones, bold VOGUE typography.",
    "prompt": "High-fashion editorial magazine cover photograph. Bold iconic luxury serif typography reading 'VOGUE' across the top. The subject now wears an architectural avant-garde structured black couture jacket with sculpted pleated shoulders, sleek swept-back wet-look editorial hairstyle, striking high-fashion makeup with defined cheekbones, dramatic high-contrast studio chiaroscuro lighting, deep graphite background, glossy magazine print sheen with subtle typographic headlines 'THE AVANT-GARDE ISSUE'.",
    "dna": {
      "subject": "Editorial high-fashion couture model",
      "lighting": "Elinchrom octabox key with silver reflector kick",
      "camera": "Hasselblad H6D-100c medium format with 100mm f/2.2",
      "texture": "Architectural wool-crepe weave & glossy print finish",
      "color": "Monochromatic graphite, obsidian & porcelain skin tones",
      "mood": "Haute couture, commanding, sculpted elegance"
    },
    "why_it_works": "Medium format camera framing combined with structured tailoring terms yields authoritative magazine cover typography and anatomy.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 4
    },
    "tags": [
      "vogue",
      "editorial",
      "high fashion",
      "magazine cover",
      "couture"
    ]
  },
  {
    "id": "cyber-01",
    "title": "Cyberpunk 2077 Hologram & Tokyo Rain",
    "category": "cinematic",
    "category_name": "Cyberpunk Sci-Fi",
    "badge": "\ud83d\udd25 Viral",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_06_cyberpunk.jpg",
    "short_description": "Glowing cyan & magenta holographic wireframe lines, cybernetic iris telemetry HUD, Tokyo street rain reflections.",
    "prompt": "Futuristic Cyberpunk 2077 neon sci-fi portrait. Glowing cyan and hot magenta holographic wireframe lines projecting around her silhouette, cybernetic glowing iris implant with digital telemetry HUD overlay, rainy Tokyo futuristic street reflections through neon-lit glass, translucent holographic coffee cup displaying temperature data 'TEMP: 68\u00b0C', high-tech dark techwear jacket with LED fiber optic seams.",
    "dna": {
      "subject": "Cybernetically augmented cafe patron",
      "lighting": "Bioluminescent neon cyan & hot magenta backlight",
      "camera": "Arri Alexa Mini LF with anamorphic flare lens",
      "texture": "Wet carbon fiber, rainy glass beads & neon glare",
      "color": "Electric cyan, neon ultraviolet & deep asphalt blue",
      "mood": "Dystopian, hyper-connected, nocturnal thrill"
    },
    "why_it_works": "Holographic telemetry HUD parameters and rainy neon bounce create layered depth between subject and backdrop.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 5
    },
    "tags": [
      "cyberpunk",
      "neon",
      "hologram",
      "sci-fi",
      "tokyo",
      "rain"
    ]
  },
  {
    "id": "bolly-01",
    "title": "1970s Bollywood Technicolor Cinema Still",
    "category": "retro_y2k",
    "category_name": "Vintage Bollywood",
    "badge": "\ud83d\udc10 Goated",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_07_vintage_bollywood.jpg",
    "short_description": "Saturated Technicolor grading, golden Indian skin tones, retro wide collar, authentic 1975 35mm film stock grain.",
    "prompt": "Authentic 1970s Bollywood masala action-romance cinema film still. Technicolor saturated warm color grading, dramatic retro Bollywood movie aesthetic, warm golden Indian skin tones, authentic 35mm Indian film stock grain of 1975, bell-bottom retro collar, dramatic vintage Hindi cinema dialogue lighting, emotional cinematic warmth.",
    "dna": {
      "subject": "1970s romantic Bollywood cinema lead",
      "lighting": "Warm tungsten flood lamps with golden rim fill",
      "camera": "Arriflex 35 IIC with Cooke vintage prime lenses",
      "texture": "Saturated Eastman color 35mm negative grain",
      "color": "Deep saffron gold, burnt sienna & retro turmeric",
      "mood": "Melodramatic, passionate, vintage golden era"
    },
    "why_it_works": "Explicitly mentioning 1975 Indian film stock chemistry and warm tungsten key evokes authentic nostalgic Technicolor warmth.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 4
    },
    "tags": [
      "bollywood",
      "technicolor",
      "1970s",
      "retro cinema",
      "vintage film"
    ]
  },
  {
    "id": "art-02",
    "title": "Caravaggio Chiaroscuro Baroque Oil Painting",
    "category": "art_anime",
    "category_name": "Baroque Masterpiece",
    "badge": "\ud83d\udc10 Goated",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_08_renaissance.jpg",
    "short_description": "Intense diagonal tenebrism beam, deep pitch-black shadow void, thick impasto brushwork, microscopic craquelure varnish cracks.",
    "prompt": "Authentic Baroque oil painting by Italian master Caravaggio. Dramatic intense chiaroscuro tenebrism lighting with a single harsh beam of candlelight striking the subject's face from high left, plunging the entire background into pitch-black shadow void. Rich impasto oil paint texture with visible fine cracks (craquelure) in the dried varnish, deep warm ochre and burnt umber earth tones, psychological emotional intensity.",
    "dna": {
      "subject": "Baroque dramatic figure study",
      "lighting": "Harsh diagonal tenebrism beam against pitch-black void",
      "camera": "Classical easel painting with camera obscura perspective",
      "texture": "Thick oil impasto, linen canvas weave & cracked varnish",
      "color": "Burnt umber, raw sienna, lead-tin yellow & pitch void",
      "mood": "Grave, spiritual, intense psychological revelation"
    },
    "why_it_works": "Craquelure, impasto oil texture, and tenebrism prompts steer diffusion away from digital airbrushing toward museum-grade canvas tactile quality.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 5
    },
    "tags": [
      "caravaggio",
      "baroque",
      "oil painting",
      "chiaroscuro",
      "museum",
      "tenembrism"
    ]
  },
  {
    "id": "toy-02",
    "title": "Aardman Claymation Stop-Motion Character",
    "category": "toys",
    "category_name": "Clay Animation",
    "badge": "\ud83d\udd25 Viral",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_09_claymation.jpg",
    "short_description": "Handmade plasticine modeling clay, visible thumbprint impressions, tiny bead pupils, hand-knitted woolen sweater, miniature set.",
    "prompt": "Charming stop-motion claymation animated character inspired by Wallace & Gromit and Aardman studios. Sculpted from colored modeling plasticine clay, visible authentic human thumbprint impressions pressed into the clay surface, handmade clay eyes with tiny black bead pupils, cozy hand-knitted woolen sweater texture, miniature warm clay coffee shop set behind the character with miniature clay tables and tiny pastry counter, soft studio stop-motion animation lighting.",
    "dna": {
      "subject": "Hand-sculpted plasticine clay figure",
      "lighting": "Diffused miniature stage lighting with soft rim",
      "camera": "Nikon DSLR stop-motion rig with macro lens",
      "texture": "Pliant clay thumbprints, chunky knitted wool, matte plasticine",
      "color": "Warm earth tones, tactile terracotta & knitted teal",
      "mood": "Quirky, handmade British stop-motion humor"
    },
    "why_it_works": "Keywords like 'visible thumbprint impressions' and 'plasticine clay eyes' ground the output in tactile hand-crafted stop-motion physics.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 5,
      "SDXL 1.0": 4
    },
    "tags": [
      "claymation",
      "stop motion",
      "aardman",
      "plasticine",
      "handmade"
    ]
  },
  {
    "id": "toy-03",
    "title": "1:87 Tilt-Shift Miniature Architectural Diorama",
    "category": "toys",
    "category_name": "Miniature Diorama",
    "badge": "\ud83d\udc8e Underrated",
    "original_image": "/static/img/ai_prompts/base_photo.jpg",
    "result_image": "/static/img/ai_prompts/trans_10_tilt_shift.jpg",
    "short_description": "1:87 HO scale architectural model diorama, 1-inch hand-painted plastic figurine, optical tilt-shift bellows depth blur.",
    "prompt": "Miniature tilt-shift diorama photograph. The entire cafe scene transformed into a 1:87 HO scale architectural model diorama. Tiny 1-inch tall hand-painted plastic miniature figurine of the subject sitting at a miniature wooden bistro table, simulated shallow depth of field with heavy top and bottom blur from a tilt-shift bellows lens, glossy enamel paint on miniature furniture, oversized ambient room lighting making the scene look tiny and precious, macro model photography.",
    "dna": {
      "subject": "1:87 HO scale miniature figurine",
      "lighting": "Oversized ambient gallery lighting above scale model",
      "camera": "Schneider Kreuznach tilt-shift bellows lens",
      "texture": "Hand-painted enamel gloss & balsa wood grain",
      "color": "Saturated model paints with warm tungsten glow",
      "mood": "Intimate, dollhouse wonder, delicate craftsmanship"
    },
    "why_it_works": "Bellows lens tilt-shift blur and HO scale architectural descriptors produce believable miniature depth perception.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 4
    },
    "tags": [
      "tilt-shift",
      "miniature",
      "diorama",
      "macro",
      "model"
    ]
  },
  {
    "id": "fash-02",
    "title": "Commercial High-End Beauty & Skin Retouching",
    "category": "fashion",
    "category_name": "Commercial Retouch",
    "badge": "\ud83d\udcc8 Rising",
    "original_image": "/static/img/ai_prompts/trans_11_retouch_before.jpg",
    "result_image": "/static/img/ai_prompts/trans_11_retouch_after.jpg",
    "short_description": "Flawless frequency separation preserving natural skin pores, sculpted specular pupil highlights, clean clamshell studio beauty light.",
    "prompt": "Commercial beauty magazine editorial close-up photograph. Perfect high-end beauty retouching maintaining natural skin pores and micro-texture through frequency separation, sculpted golden specular catchlights in pupils, subtle warm lip tint with natural hydration gloss, softly feathered eyebrow grooming, clean studio clamshell beauty lighting, seamless neutral taupe background, luxury cosmetics advertisement quality.",
    "dna": {
      "subject": "Commercial cosmetics beauty portrait",
      "lighting": "Clamshell studio lighting with 33-inch beauty dish",
      "camera": "Phase One XF IQ4 150MP with Schneider 110mm LS f/2.8",
      "texture": "Individual natural skin pores & velvet makeup veil",
      "color": "Luminous ivory, rose quartz & warm bronze undertones",
      "mood": "Pristine, aspirational, radiant luxury"
    },
    "why_it_works": "Directing the AI toward 'natural skin pores' and 'frequency separation' preserves authentic biological micro-texture without plastic blurring.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 5
    },
    "tags": [
      "retouching",
      "beauty",
      "commercial",
      "skin",
      "editorial",
      "cosmetics"
    ]
  },
  {
    "id": "arch-01",
    "title": "Studio Tokyo: Day-to-Night Volumetric Relighting",
    "category": "cinematic",
    "category_name": "Interior Relighting",
    "badge": "\ud83d\udc10 Goated",
    "original_image": "/static/img/ai_prompts/trans_12_workspace_day.jpg",
    "result_image": "/static/img/ai_prompts/trans_12_workspace_night.jpg",
    "short_description": "Sunlit creative workspace dynamically transformed into nocturnal rainy Tokyo study with warm amber desk lamp and neon reflections.",
    "prompt": "Cozy nocturnal Tokyo creative studio workspace at 2:00 AM. Rain trickling down wide window overlooking misty neon Shibuya cityscape, room illuminated solely by warm amber incandescent anglepoise desk lamp, soft ultraviolet LED strip behind dual curved monitors, steam rising from ceramic matcha cup, moody contemplative ambient darkness, cinematic lo-fi anime lofi hip hop aesthetic, volumetric soft shadows.",
    "dna": {
      "subject": "Creative designer workspace & monitor desk",
      "lighting": "Nocturnal interior with warm amber lamp & neon bounce",
      "camera": "Sony A7S III with 35mm G Master f/1.4",
      "texture": "Warm wood desk grain, wet window raindrops & matte keyboard",
      "color": "Nocturnal indigo, neon violet, neon cyan & warm amber",
      "mood": "Peaceful, late-night deep work flow, cozy rain focus"
    },
    "why_it_works": "Contrasting a singular warm desk lamp against exterior rain and cold neon city bounce produces immense volumetric depth.",
    "models": {
      "Midjourney v6.1": 5,
      "Flux.1 Dev": 5,
      "DALL-E 3": 4,
      "SDXL 1.0": 5
    },
    "tags": [
      "relighting",
      "lo-fi",
      "workspace",
      "tokyo",
      "interior",
      "rain",
      "cozy"
    ]
  }
];

window.AI_PROMPTS_CATEGORIES = AI_PROMPTS_CATEGORIES;
window.AI_PROMPTS_DATA = AI_PROMPTS_DATA;
