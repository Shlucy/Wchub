# World Cup 2026 Tickets Website

Static website for World Cup 2026 ticket inquiries. The site should look professional, list all tournament matches/stadiums/teams, and send every buyer inquiry to WhatsApp instead of taking payment online.

## Core Goal

Visitors browse World Cup 2026 matches, choose the match or stadium they want, then click a ticket button. The button opens WhatsApp with a pre-filled message to one of four US WhatsApp numbers owned by the seller.

## Important Positioning

This must be presented as an independent ticket inquiry/resale service, not an official FIFA website.

Use clear language such as:

- "Independent ticket assistance service"
- "Tickets are subject to availability and verification"
- "Not affiliated with FIFA, FIFA World Cup 26, host cities, stadiums, or national teams"
- "Official tournament information should be confirmed on FIFA.com"

Avoid:

- Saying the site is an official FIFA seller unless licensed
- Using FIFA logos, official marks, or copyrighted graphics without permission
- Fake testimonials, fake buyer protection claims, or guaranteed ticket claims
- Taking payment before availability is confirmed

## Verified Tournament Facts

Use FIFA as the source of truth and re-check before launch.

- Tournament dates: June 11, 2026 to July 19, 2026
- Hosts: Canada, Mexico, United States
- Format: 48 teams, 12 groups of four, 104 matches
- Opening match: June 11, 2026 at Mexico City Stadium
- Final: July 19, 2026 at New York New Jersey Stadium
- Host cities: Toronto, Vancouver, Guadalajara, Mexico City, Monterrey, Atlanta, Boston, Dallas, Houston, Kansas City, Los Angeles, Miami, New York New Jersey, Philadelphia, San Francisco Bay Area, Seattle

Primary sources:

- FIFA tournament overview: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-world-cup-2026-hosts-cities-dates-usa-mexico-canada
- FIFA qualified teams: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/world-cup-2026-who-has-qualified
- FIFA match schedule: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums

## Qualified Teams

Co-hosts:

- Canada
- Mexico
- United States

AFC:

- Australia
- Iraq
- IR Iran
- Japan
- Jordan
- Korea Republic
- Qatar
- Saudi Arabia
- Uzbekistan

CAF:

- Algeria
- Cabo Verde
- Congo DR
- Cote d'Ivoire
- Egypt
- Ghana
- Morocco
- Senegal
- South Africa
- Tunisia

Concacaf:

- Curacao
- Haiti
- Panama

CONMEBOL:

- Argentina
- Brazil
- Colombia
- Ecuador
- Paraguay
- Uruguay

OFC:

- New Zealand

UEFA:

- Austria
- Belgium
- Bosnia and Herzegovina
- Croatia
- Czechia
- England
- France
- Germany
- Netherlands
- Norway
- Portugal
- Scotland
- Spain
- Sweden
- Switzerland
- Turkiye

## Current Folder Structure

```text
worldcup2026tickets/
├── index.html
├── matches.html
├── stadiums.html
├── teams.html
├── how-it-works.html
├── contact.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── matches.js
│   │   └── whatsapp.js
│   ├── images/
│   │   ├── hero/
│   │   ├── stadiums/
│   │   ├── flags/
│   │   ├── teams/
│   │   ├── icons/
│   │   └── logo.png
│   └── documents/
│       └── disclaimer.pdf
├── includes/
│   ├── header.html
│   ├── footer.html
│   └── navbar.html
└── pages/
```

## Page Plan

Home:

- Hero cover image
- Countdown to opening match
- Popular ticket categories
- Featured matches
- Trust/verification section
- WhatsApp call to action

Matches:

- All matches
- Filters by date, country/team, stadium, city, stage
- Buy ticket buttons with match-specific WhatsApp message

Stadiums:

- 16 host stadiums
- Stadium images
- Seating arrangement images
- City and country labels

Teams:

- All 48 qualified teams
- Flag grid
- Confederation grouping

How It Works:

- Choose match
- Send inquiry on WhatsApp
- Confirm availability/category
- Receive payment instructions
- Receive ticket details after confirmation

Contact:

- WhatsApp button
- Email/contact form if needed
- Business hours
- Disclaimer

## WhatsApp Redirect Logic

Store the four US WhatsApp numbers in `assets/js/whatsapp.js`.

Replace the placeholder numbers with digits only:

```js
numbers: [
  "15551234567",
  "15557654321",
  "15559876543",
  "15553456789",
]
```

Every buy button should include:

- Match name/details
- Date
- Stadium/city
- Requested ticket category if selected
- Quantity if selected

The script should select one of the four numbers randomly or in rotation and open:

```text
https://wa.me/1XXXXXXXXXX?text=Hi%2C%20I%20want%20tickets%20for...
```

Use digits only in the WhatsApp number, without `+`, spaces, or punctuation.

Ticket button pattern:

```html
<a
  class="button button-primary"
  href="#"
  data-whatsapp-ticket
  data-match="Mexico vs To Be Confirmed"
  data-stage="Opening Match"
  data-date="June 11, 2026"
  data-stadium="Mexico City Stadium"
  data-city="Mexico City"
  data-category="Category 1"
  data-quantity="2"
>
  Check Availability
</a>
```

General WhatsApp button pattern:

```html
<a class="button button-primary" href="#" data-whatsapp-general>
  Continue on WhatsApp
</a>
```

## Asset Rules

The user already has flags and stadium images. Put them here:

- Flags: `assets/images/flags/`
- Stadium photos: `assets/images/stadiums/`
- Cover images: `assets/images/hero/`
- Team images if used: `assets/images/teams/`
- Icons: `assets/images/icons/`

Recommended cover images:

- Homepage: final venue or strong stadium crowd image
- Matches page: football pitch/stadium image
- Stadiums page: stadium collage or venue exterior
- Teams page: flags collage
- How It Works page: clean support/WhatsApp-themed image

## Build Order

1. Add real images and final brand name/logo.
2. Fill `whatsapp.js` with the four WhatsApp numbers.
3. Build shared CSS and responsive layout.
4. Build the homepage first.
5. Build match data and filters.
6. Build stadium and team pages.
7. Add disclaimers and trust content.
8. Test every WhatsApp button on desktop and mobile.
9. Re-check tournament facts against FIFA before launch.
