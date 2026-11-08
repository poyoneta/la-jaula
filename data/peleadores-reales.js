// Peleadores reales del peso pluma (SOLO COPIA LOCAL: no va en la versión publicada).
// Reemplazan a los inventados del peso pluma: campeón y puestos 1 a 15.
// Las estadísticas son aproximadas, para el juego: ajustalas como te parezca.
const PLUMA_REALES=[
 {div:'pluma',rank:0,name:'Alexander Volkanovski',last:'Volkanovski',nick:'"The Great"',flag:'AUS',style:'Completo',sprite:'volkanovski',
  s:{str:90,pow:82,spd:86,wre:86,tdd:90,bjj:78,car:94,chin:84},look:{skin:'#e2b48c',hair:'#6b4a2e',hairStyle:'bald',beardStyle:'stubble',shorts:'#2f7d32',trim:'#ffffff',tattoo:'sleeve',body:'normal'}},
 {div:'pluma',rank:1,name:'Movsar Evloev',last:'Evloev',nick:'',flag:'RUS',style:'Lucha libre',sprite:'evloev',
  s:{str:78,pow:70,spd:80,wre:93,tdd:88,bjj:80,car:90,chin:82},look:{skin:'#e8bf9c',hair:'#4a2e1a',hairStyle:'long',beardStyle:'stubble',shorts:'#3a3d44',trim:'#ffffff',body:'normal'}},
 {div:'pluma',rank:2,name:'Diego Lopes',last:'Lopes',nick:'',flag:'BRA',style:'Striker',sprite:'lopes',
  s:{str:84,pow:86,spd:82,wre:70,tdd:70,bjj:86,car:84,chin:82},look:{skin:'#dcb08a',hair:'#5a3a22',hairStyle:'short',beardStyle:'stache',shorts:'#b3202a',trim:'#ffffff',tattoo:'chest',body:'normal'}},
 {div:'pluma',rank:3,name:'Lerone Murphy',last:'Murphy',nick:'"The Miracle"',flag:'ENG',style:'Striker',sprite:'murphy',
  s:{str:86,pow:80,spd:84,wre:70,tdd:80,bjj:70,car:82,chin:84},look:{skin:'#e6be98',hair:'#5a3a22',hairStyle:'sidecut',beardStyle:'stubble',shorts:'#d9dbe0',trim:'#3b4a8a',tattoo:'chest',body:'lean'}},
 {div:'pluma',rank:4,name:'Aljamain Sterling',last:'Sterling',nick:'"Funk Master"',flag:'USA',style:'Jiu-jitsu',sprite:'sterling',
  s:{str:76,pow:64,spd:80,wre:90,tdd:78,bjj:92,car:88,chin:74},look:{skin:'#6e4430',hair:'#0e0a08',hairStyle:'bald',beardStyle:'full',shorts:'#2a2c31',trim:'#ffffff',body:'lean'}},
 {div:'pluma',rank:5,name:'Jean Silva',last:'Silva',nick:'"Lord"',flag:'BRA',style:'Pegador',sprite:'silva',
  s:{str:84,pow:90,spd:80,wre:66,tdd:72,bjj:68,car:80,chin:80},look:{skin:'#e2b48c',hair:'#8a5a2b',hairStyle:'bald',beardStyle:'full',shorts:'#2b3550',trim:'#ffffff',tattoo:'chest',body:'normal'}},
 {div:"pluma",rank:6,name:"Arnold Allen",last:"Allen",nick:"\"Almighty\"",flag:"ENG",style:"Kickboxing",sprite:"allen",s:{str:93,pow:72,spd:97,wre:59,tdd:79,bjj:62,car:92,chin:70},look:{skin:"#e2b48c",hair:"#7a5230",hairStyle:"long",beardStyle:"full",shorts:"#c0485a",trim:"#ffffff",tattoo:"sleeve",body:"normal"}},
 {div:"pluma",rank:7,name:"Pat Sabatini",last:"Sabatini",nick:"",flag:"USA",style:"Jiu-jitsu",sprite:"sabatini",s:{str:68,pow:63,spd:79,wre:80,tdd:66,bjj:97,car:87,chin:77},look:{skin:"#e8bf9c",hair:"#8a6a3a",hairStyle:"buzz",beardStyle:"stubble",shorts:"#5b86c4",trim:"#ffffff",body:"normal"}},
 {div:"pluma",rank:8,name:"Pavel Andrusca",last:"Andrusca",nick:"",flag:"—",style:"Completo",sprite:"andrusca",s:{str:75,pow:68,spd:78,wre:74,tdd:74,bjj:73,car:84,chin:74},look:{skin:"#e8bf9c",hair:"#8a6a3a",hairStyle:"buzz",beardStyle:"none",shorts:"#9a9da3",trim:"#ffffff",body:"lean"}},
 {div:"pluma",rank:9,name:"Youssef Zalal",last:"Zalal",nick:"",flag:"MAR",style:"Kickboxing",sprite:"zalal",s:{str:89,pow:68,spd:94,wre:55,tdd:75,bjj:58,car:88,chin:66},look:{skin:"#c58b62",hair:"#14100c",hairStyle:"buzz",beardStyle:"full",shorts:"#b3202a",trim:"#ffffff",body:"lean"}},
 {div:"pluma",rank:10,name:"Aaron Pico",last:"Pico",nick:"",flag:"USA",style:"Completo",sprite:"pico",s:{str:72,pow:65,spd:75,wre:71,tdd:71,bjj:70,car:81,chin:71},look:{skin:"#e2b48c",hair:"#3a2416",hairStyle:"buzz",beardStyle:"full",shorts:"#2a2c31",trim:"#ffffff",body:"normal"}},
 {div:"pluma",rank:11,name:"Kevin Vallejos",last:"Vallejos",nick:"",flag:"ARG",style:"Striker",sprite:"vallejos",s:{str:82,pow:79,spd:77,wre:57,tdd:67,bjj:52,car:77,chin:75},look:{skin:"#e2b48c",hair:"#14100c",hairStyle:"short",beardStyle:"none",shorts:"#2a2c31",trim:"#ffffff",body:"lean"}},
 {div:"pluma",rank:12,name:"Joanderson Brito",last:"Brito",nick:"",flag:"BRA",style:"Pegador",sprite:"brito",s:{str:72,pow:91,spd:63,wre:62,tdd:62,bjj:47,car:65,chin:89},look:{skin:"#bf9070",hair:"#3a2416",hairStyle:"bald",beardStyle:"stubble",shorts:"#d4b21f",trim:"#ffffff",tattoo:"sleeve",body:"normal"}},
 {div:"pluma",rank:13,name:"Melquizael Costa",last:"Costa",nick:"",flag:"BRA",style:"Kickboxing",sprite:"costa",s:{str:82,pow:61,spd:87,wre:48,tdd:68,bjj:51,car:81,chin:59},look:{skin:"#d8ae86",hair:"#8a6a3a",hairStyle:"buzz",beardStyle:"stubble",shorts:"#3f9a5a",trim:"#ffffff",body:"normal"}},
 {div:"pluma",rank:14,name:"Steve Garcia",last:"Garcia",nick:"",flag:"USA",style:"Striker",sprite:"garcia",s:{str:77,pow:74,spd:72,wre:52,tdd:62,bjj:47,car:72,chin:70},look:{skin:"#e6bf98",hair:"#5a3a22",hairStyle:"short",beardStyle:"stache",shorts:"#2349b8",trim:"#ffffff",tattoo:"chest",body:"normal"}},
 {div:"pluma",rank:15,name:"Jamall Emmers",last:"Emmers",nick:"",flag:"USA",style:"Lucha libre",sprite:"emmers",s:{str:53,pow:48,spd:58,wre:79,tdd:75,bjj:61,car:80,chin:66},look:{skin:"#8a5a3b",hair:"#14100c",hairStyle:"buzz",beardStyle:"full",shorts:"#7a2fb3",trim:"#ffffff",body:"normal"}}
];
// Ficha: completá "bio" de cada uno si querés que se vea en la pantalla de elección, por ejemplo:
// bio:{edad:31, altura:168, alcance:182, posicion:'Ortodoxo', ciudad:'Wollongong, Australia', procedencia:'...', record:'26-4-0'}
for(const f of PLUMA_REALES){f.real=1;const i=ROSTER.findIndex(x=>x.div===f.div&&x.rank===f.rank);if(i>=0)ROSTER[i]=f;else ROSTER.push(f);}
