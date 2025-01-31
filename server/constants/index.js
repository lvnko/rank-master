const COUNTRIES_OR_REGIONS = [
    { name: "afghanistan", translation: "Afghanistan", code: "93" },
    { name: "albania", translation: "Albania", code: "355" },
    { name: "algeria", translation: "Algeria", code: "213" },
    { name: "american_samoa", translation: "American Samoa", code: "1-684" },
    { name: "andorra", translation: "Andorra", code: "376" },
    { name: "angola", translation: "Angola", code: "244" },
    { name: "anguilla", translation: "Anguilla", code: "1-264" },
    { name: "antarctica", translation: "Antarctica", code: "672" },
    { name: "antigua_and_barbuda", translation: "Antigua and Barbuda", code: "1-268" },
    { name: "argentina", translation: "Argentina", code: "54" },
    { name: "armenia", translation: "Armenia", code: "374" },
    { name: "aruba", translation: "Aruba", code: "297" },
    { name: "australia", translation: "Australia", code: "61" },
    { name: "austria", translation: "Austria", code: "43" },
    { name: "azerbaijan", translation: "Azerbaijan", code: "994" },
    { name: "bahamas", translation: "Bahamas", code: "1-242" },
    { name: "bahrain", translation: "Bahrain", code: "973" },
    { name: "bangladesh", translation: "Bangladesh", code: "880" },
    { name: "barbados", translation: "Barbados", code: "1-246" },
    { name: "belarus", translation: "Belarus", code: "375" },
    { name: "belgium", translation: "Belgium", code: "32" },
    { name: "belize", translation: "Belize", code: "501" },
    { name: "benin", translation: "Benin", code: "229" },
    { name: "bermuda", translation: "Bermuda", code: "1-441" },
    { name: "bhutan", translation: "Bhutan", code: "975" },
    { name: "bolivia", translation: "Bolivia", code: "591" },
    { name: "bosnia_and_herzegovina", translation: "Bosnia and Herzegovina", code: "387" },
    { name: "botswana", translation: "Botswana", code: "267" },
    { name: "brazil", translation: "Brazil", code: "55" },
    { name: "british_indian_ocean_territory", translation: "British Indian Ocean Territory", code: "246" },
    { name: "british_virgin_islands", translation: "British Virgin Islands", code: "1-284" },
    { name: "brunei", translation: "Brunei", code: "673" },
    { name: "bulgaria", translation: "Bulgaria", code: "359" },
    { name: "burkina_faso", translation: "Burkina Faso", code: "226" },
    { name: "burundi", translation: "Burundi", code: "257" },
    { name: "cambodia", translation: "Cambodia", code: "855" },
    { name: "cameroon", translation: "Cameroon", code: "237" },
    { name: "canada", translation: "Canada", code: "1" },
    { name: "cape_verde", translation: "Cape Verde", code: "238" },
    { name: "cayman_islands", translation: "Cayman Islands", code: "1-345" },
    { name: "central_african_republic", translation: "Central African Republic", code: "236" },
    { name: "chad", translation: "Chad", code: "235" },
    { name: "chile", translation: "Chile", code: "56" },
    { name: "china", translation: "China", code: "86" },
    { name: "christmas_island", translation: "Christmas Island", code: "61" },
    { name: "cocos_islands", translation: "Cocos Islands", code: "61" },
    { name: "colombia", translation: "Colombia", code: "57" },
    { name: "comoros", translation: "Comoros", code: "269" },
    { name: "cook_islands", translation: "Cook Islands", code: "682" },
    { name: "costa_rica", translation: "Costa Rica", code: "506" },
    { name: "croatia", translation: "Croatia", code: "385" },
    { name: "cuba", translation: "Cuba", code: "53" },
    { name: "curacao", translation: "Curacao", code: "599" },
    { name: "cyprus", translation: "Cyprus", code: "357" },
    { name: "czech_republic", translation: "Czech Republic", code: "420" },
    { name: "democratic_republic_of_the_congo", translation: "Democratic Republic of the Congo", code: "243" },
    { name: "denmark", translation: "Denmark", code: "45" },
    { name: "djibouti", translation: "Djibouti", code: "253" },
    { name: "dominica", translation: "Dominica", code: "1-767" },
    { name: "dominican_republic", translation: "Dominican Republic", code: "1-809, 1-829, 1-849" },
    { name: "east_timor", translation: "East Timor", code: "670" },
    { name: "ecuador", translation: "Ecuador", code: "593" },
    { name: "egypt", translation: "Egypt", code: "20" },
    { name: "el_salvador", translation: "El Salvador", code: "503" },
    { name: "equatorial_guinea", translation: "Equatorial Guinea", code: "240" },
    { name: "eritrea", translation: "Eritrea", code: "291" },
    { name: "estonia", translation: "Estonia", code: "372" },
    { name: "ethiopia", translation: "Ethiopia", code: "251" },
    { name: "falkland_islands", translation: "Falkland Islands", code: "500" },
    { name: "faroe_islands", translation: "Faroe Islands", code: "298" },
    { name: "fiji", translation: "Fiji", code: "679" },
    { name: "finland", translation: "Finland", code: "358" },
    { name: "france", translation: "France", code: "33" },
    { name: "french_polynesia", translation: "French Polynesia", code: "689" },
    { name: "gabon", translation: "Gabon", code: "241" },
    { name: "gambia", translation: "Gambia", code: "220" },
    { name: "georgia", translation: "Georgia", code: "995" },
    { name: "germany", translation: "Germany", code: "49" },
    { name: "ghana", translation: "Ghana", code: "233" },
    { name: "gibraltar", translation: "Gibraltar", code: "350" },
    { name: "greece", translation: "Greece", code: "30" },
    { name: "greenland", translation: "Greenland", code: "299" },
    { name: "grenada", translation: "Grenada", code: "1-473" },
    { name: "guam", translation: "Guam", code: "1-671" },
    { name: "guatemala", translation: "Guatemala", code: "502" },
    { name: "guernsey", translation: "Guernsey", code: "44-1481" },
    { name: "guinea", translation: "Guinea", code: "224" },
    { name: "guinea_bissau", translation: "Guinea-Bissau", code: "245" },
    { name: "guyana", translation: "Guyana", code: "592" },
    { name: "haiti", translation: "Haiti", code: "509" },
    { name: "honduras", translation: "Honduras", code: "504" },
    { name: "hong_kong", translation: "Hong Kong", code: "852" },
    { name: "hungary", translation: "Hungary", code: "36" },
    { name: "iceland", translation: "Iceland", code: "354" },
    { name: "india", translation: "India", code: "91" },
    { name: "indonesia", translation: "Indonesia", code: "62" },
    { name: "iran", translation: "Iran", code: "98" },
    { name: "iraq", translation: "Iraq", code: "964" },
    { name: "ireland", translation: "Ireland", code: "353" },
    { name: "isle_of_man", translation: "Isle of Man", code: "44-1624" },
    { name: "israel", translation: "Israel", code: "972" },
    { name: "italy", translation: "Italy", code: "39" },
    { name: "ivory_coast", translation: "Ivory Coast", code: "225" },
    { name: "jamaica", translation: "Jamaica", code: "1-876" },
    { name: "japan", translation: "Japan", code: "81" },
    { name: "jersey", translation: "Jersey", code: "44-1534" },
    { name: "jordan", translation: "Jordan", code: "962" },
    { name: "kazakhstan", translation: "Kazakhstan", code: "7" },
    { name: "kenya", translation: "Kenya", code: "254" },
    { name: "kiribati", translation: "Kiribati", code: "686" },
    { name: "kosovo", translation: "Kosovo", code: "383" },
    { name: "kuwait", translation: "Kuwait", code: "965" },
    { name: "kyrgyzstan", translation: "Kyrgyzstan", code: "996" },
    { name: "laos", translation: "Laos", code: "856" },
    { name: "latvia", translation: "Latvia", code: "371" },
    { name: "lebanon", translation: "Lebanon", code: "961" },
    { name: "lesotho", translation: "Lesotho", code: "266" },
    { name: "liberia", translation: "Liberia", code: "231" },
    { name: "libya", translation: "Libya", code: "218" },
    { name: "liechtenstein", translation: "Liechtenstein", code: "423" },
    { name: "lithuania", translation: "Lithuania", code: "370" },
    { name: "luxembourg", translation: "Luxembourg", code: "352" },
    { name: "macau", translation: "Macau", code: "853" },
    { name: "macedonia", translation: "Macedonia", code: "389" },
    { name: "madagascar", translation: "Madagascar", code: "261" },
    { name: "malawi", translation: "Malawi", code: "265" },
    { name: "malaysia", translation: "Malaysia", code: "60" },
    { name: "maldives", translation: "Maldives", code: "960" },
    { name: "mali", translation: "Mali", code: "223" },
    { name: "malta", translation: "Malta", code: "356" },
    { name: "marshall_islands", translation: "Marshall Islands", code: "692" },
    { name: "mauritania", translation: "Mauritania", code: "222" },
    { name: "mauritius", translation: "Mauritius", code: "230" },
    { name: "mayotte", translation: "Mayotte", code: "262" },
    { name: "mexico", translation: "Mexico", code: "52" },
    { name: "micronesia", translation: "Micronesia", code: "691" },
    { name: "moldova", translation: "Moldova", code: "373" },
    { name: "monaco", translation: "Monaco", code: "377" },
    { name: "mongolia", translation: "Mongolia", code: "976" },
    { name: "montenegro", translation: "Montenegro", code: "382" },
    { name: "montserrat", translation: "Montserrat", code: "1-664" },
    { name: "morocco", translation: "Morocco", code: "212" },
    { name: "mozambique", translation: "Mozambique", code: "258" },
    { name: "myanmar", translation: "Myanmar", code: "95" },
    { name: "namibia", translation: "Namibia", code: "264" },
    { name: "nauru", translation: "Nauru", code: "674" },
    { name: "nepal", translation: "Nepal", code: "977" },
    { name: "netherlands", translation: "Netherlands", code: "31" },
    { name: "netherlands_antilles", translation: "Netherlands Antilles", code: "599" },
    { name: "new_caledonia", translation: "New Caledonia", code: "687" },
    { name: "new_zealand", translation: "New Zealand", code: "64" },
    { name: "nicaragua", translation: "Nicaragua", code: "505" },
    { name: "niger", translation: "Niger", code: "227" },
    { name: "nigeria", translation: "Nigeria", code: "234" },
    { name: "niue", translation: "Niue", code: "683" },
    { name: "north_korea", translation: "North Korea", code: "850" },
    { name: "northern_mariana_islands", translation: "Northern Mariana Islands", code: "1-670" },
    { name: "norway", translation: "Norway", code: "47" },
    { name: "oman", translation: "Oman", code: "968" },
    { name: "pakistan", translation: "Pakistan", code: "92" },
    { name: "palau", translation: "Palau", code: "680" },
    { name: "palestine", translation: "Palestine", code: "970" },
    { name: "panama", translation: "Panama", code: "507" },
    { name: "papua_new_guinea", translation: "Papua New Guinea", code: "675" },
    { name: "paraguay", translation: "Paraguay", code: "595" },
    { name: "peru", translation: "Peru", code: "51" },
    { name: "philippines", translation: "Philippines", code: "63" },
    { name: "pitcairn", translation: "Pitcairn", code: "64" },
    { name: "poland", translation: "Poland", code: "48" },
    { name: "portugal", translation: "Portugal", code: "351" },
    { name: "puerto_rico", translation: "Puerto Rico", code: "1-787, 1-939" },
    { name: "qatar", translation: "Qatar", code: "974" },
    { name: "republic_of_the_congo", translation: "Republic of the Congo", code: "242" },
    { name: "reunion", translation: "Reunion", code: "262" },
    { name: "romania", translation: "Romania", code: "40" },
    { name: "russia", translation: "Russia", code: "7" },
    { name: "rwanda", translation: "Rwanda", code: "250" },
    { name: "saint_barthelemy", translation: "Saint Barthelemy", code: "590" },
    { name: "saint_helena", translation: "Saint Helena", code: "290" },
    { name: "saint_kitts_and_nevis", translation: "Saint Kitts and Nevis", code: "1-869" },
    { name: "saint_lucia", translation: "Saint Lucia", code: "1-758" },
    { name: "saint_martin", translation: "Saint Martin", code: "590" },
    { name: "saint_pierre_and_miquelon", translation: "Saint Pierre and Miquelon", code: "508" },
    { name: "saint_vincent_and_the_grenadines", translation: "Saint Vincent and the Grenadines", code: "1-784" },
    { name: "samoa", translation: "Samoa", code: "685" },
    { name: "san_marino", translation: "San Marino", code: "378" },
    { name: "sao_tome_and_principe", translation: "Sao Tome and Principe", code: "239" },
    { name: "saudi_arabia", translation: "Saudi Arabia", code: "966" },
    { name: "senegal", translation: "Senegal", code: "221" },
    { name: "serbia", translation: "Serbia", code: "381" },
    { name: "seychelles", translation: "Seychelles", code: "248" },
    { name: "sierra_leone", translation: "Sierra Leone", code: "232" },
    { name: "singapore", translation: "Singapore", code: "65" },
    { name: "sint_maarten", translation: "Sint Maarten", code: "1-721" },
    { name: "slovakia", translation: "Slovakia", code: "421" },
    { name: "slovenia", translation: "Slovenia", code: "386" },
    { name: "solomon_islands", translation: "Solomon Islands", code: "677" },
    { name: "somalia", translation: "Somalia", code: "252" },
    { name: "south_africa", translation: "South Africa", code: "27" },
    { name: "south_korea", translation: "South Korea", code: "82" },
    { name: "south_sudan", translation: "South Sudan", code: "211" },
    { name: "spain", translation: "Spain", code: "34" },
    { name: "sri_lanka", translation: "Sri Lanka", code: "94" },
    { name: "sudan", translation: "Sudan", code: "249" },
    { name: "suriname", translation: "Suriname", code: "597" },
    { name: "svalbard_and_jan_mayen", translation: "Svalbard and Jan Mayen", code: "47" },
    { name: "swaziland", translation: "Swaziland", code: "268" },
    { name: "sweden", translation: "Sweden", code: "46" },
    { name: "switzerland", translation: "Switzerland", code: "41" },
    { name: "syria", translation: "Syria", code: "963" },
    { name: "taiwan", translation: "Taiwan", code: "886" },
    { name: "tajikistan", translation: "Tajikistan", code: "992" },
    { name: "tanzania", translation: "Tanzania", code: "255" },
    { name: "thailand", translation: "Thailand", code: "66" },
    { name: "togo", translation: "Togo", code: "228" },
    { name: "tokelau", translation: "Tokelau", code: "690" },
    { name: "tonga", translation: "Tonga", code: "676" },
    { name: "trinidad_and_tobago", translation: "Trinidad and Tobago", code: "1-868" },
    { name: "tunisia", translation: "Tunisia", code: "216" },
    { name: "turkey", translation: "Turkey", code: "90" },
    { name: "turkmenistan", translation: "Turkmenistan", code: "993" },
    { name: "turks_and_caicos_islands", translation: "Turks and Caicos Islands", code: "1-649" },
    { name: "tuvalu", translation: "Tuvalu", code: "688" },
    { name: "us_virgin_islands", translation: "U.S. Virgin Islands", code: "1-340" },
    { name: "uganda", translation: "Uganda", code: "256" },
    { name: "ukraine", translation: "Ukraine", code: "380" },
    { name: "united_arab_emirates", translation: "United Arab Emirates", code: "971" },
    { name: "united_kingdom", translation: "United Kingdom", code: "44" },
    { name: "united_states", translation: "United States", code: "1" },
    { name: "uruguay", translation: "Uruguay", code: "598" },
    { name: "uzbekistan", translation: "Uzbekistan", code: "998" },
    { name: "vanuatu", translation: "Vanuatu", code: "678" },
    { name: "vatican", translation: "Vatican", code: "379" },
    { name: "venezuela", translation: "Venezuela", code: "58" },
    { name: "vietnam", translation: "Vietnam", code: "84" },
    { name: "wallis_and_futuna", translation: "Wallis and Futuna", code: "681" },
    { name: "western_sahara", translation: "Western Sahara", code: "212" },
    { name: "yemen", translation: "Yemen", code: "967" },
    { name: "zambia", translation: "Zambia", code: "260" },
    { name: "zimbabwe", translation: "Zimbabwe", code: "263" }
];

const ROLE_TYPES = ["fair", "subject", "respondant"];

const SUBSCRIPTION_TYPES = ["fair", "standard", "professional"];

const SURVEY_STATUS = ["inactive", "active", "suspended"];

const VALUE_TYPES = ["string", "numeric", "boolean"];

const INPUT_TYPES = ["text_input", "num_input", "selection", "selection_multiple", "switch"];

const GENDER_TYPES = ["M", "F"];

module.exports = {
    COUNTRIES_OR_REGIONS,
    ROLE_TYPES,
    SUBSCRIPTION_TYPES,
    SURVEY_STATUS,
    VALUE_TYPES,
    INPUT_TYPES,
    GENDER_TYPES
}
