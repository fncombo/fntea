const tea = [
    {
        type: 1,
        color: '#e3dc65',
        name: 'Dragon Well',
        nameOther: 'Long Jing',
        season: '28th March 2017',
        cultivar: 'Xiao Ye',
        origin: 'Xinchang, Zhejiang, China',
        rating: 5,
        updated: '13/01/2018',
        link: 'https://meileaf.com/tea/imperial-green-pre-qing-ming/',
        brewing: {
            western: {
                temperature: 80,
                amount: 1,
                baseDuration: 120,
                durationIncrease: 60,
                infusions: 2,
            },
            gongfu: {
                temperature: 80,
                amount: 3.5,
                baseDuration: 20,
                durationIncrease: 15,
                infusions: 5,
            },
        },
    },
    {
        type: 2,
        color: '#e7d161',
        name: 'White Hair Silver Needle',
        nameOther: 'Bai Hao Yin Zhen',
        season: '19th March 2017',
        cultivar: 'Da Bai',
        origin: 'Songyang, Zhejiang, China',
        rating: 5,
        updated: '13/01/2018',
        link: 'https://meileaf.com/tea/silver-needle/',
        brewing: {
            western: {
                temperature: 80,
                amount: 1,
                baseDuration: 180,
                durationIncrease: 30,
                infusions: 3,
            },
            gongfu: {
                temperature: 80,
                amount: 4,
                baseDuration: 60,
                durationIncrease: 30,
                infusions: 5,
            },
        },
    },
    {
        type: 1,
        color: '#bedd41',
        name: 'Jade Dew',
        nameOther: 'Yame Gyokuro',
        season: 'Shincha 2017',
        cultivar: 'Yabukita',
        origin: 'Yame, Fukuoka, Japan',
        rating: 5,
        updated: '13/01/2018',
        link: 'https://www.o-cha.com/yame-gyokuro.html',
        brewing: {
            gongfu: {
                temperature: 60,
                amount: 4.5,
                baseDuration: 120,
                durationIncrease: 30,
                infusions: 5,
            },
        },
    },
    {
        type: 1,
        color: '#c5d941',
        name: 'Kanaya Midori Sencha',
        nameOther: false,
        season: 'Shincha 2017',
        cultivar: 'Kanaya Midori',
        origin: 'Kirishima, Kagoshima, Japan',
        rating: 5,
        updated: '13/01/2018',
        link: 'https://www.o-cha.com/fr/japanese-organic-sencha.html',
        brewing: {
            western: {
                temperature: 70,
                amount: 1,
                baseDuration: 120,
                durationIncrease: 20,
                infusions: 2,
            },
            gongfu: {
                temperature: 70,
                amount: 3.5,
                baseDuration: 60,
                durationIncrease: 10,
                infusions: 5,
            },
        },
    },
    {
        type: 4,
        color: '#890008',
        name: 'Black Rose',
        nameOther: false,
        season: 'April 2017',
        cultivar: 'Zheng He',
        origin: 'Wuyi, Fujian, China',
        rating: 4,
        updated: '13/01/2018',
        link: 'https://meileaf.com/tea/black-rose/',
        brewing: {
            western: {
                temperature: 90,
                amount: 1,
                baseDuration: 120,
                durationIncrease: 60,
                infusions: 4,
            },
            gongfu: {
                temperature: 90,
                amount: 4.5,
                baseDuration: 10,
                durationIncrease: 5,
                infusions: 8,
            },
        },
    },
    {
        type: 4,
        color: '#a81b00',
        name: 'Keemun',
        nameOther: 'Qimen Hao Ya',
        season: 'Spring 2017',
        cultivar: 'Zu Ye Zhong',
        origin: 'Mingzhou, Anhui, China',
        rating: 3,
        updated: '13/01/2018',
        link: 'https://meileaf.com/tea/superior-keemun/',
        brewing: {
            western: {
                temperature: 90,
                amount: 1,
                baseDuration: 120,
                durationIncrease: 60,
                infusions: 3,
            },
            gongfu: {
                temperature: 90,
                amount: 4.5,
                baseDuration: 10,
                durationIncrease: 5,
                infusions: 8,
            },
        },
    },
    {
        type: 3,
        color: '#e4b34c',
        name: 'Jasmine Jade',
        nameOther: 'Mo Li Wulong',
        season: '28th April 2017',
        cultivar: 'Huang Dan',
        origin: 'Jingu, Fujian, China',
        rating: 4,
        updated: '13/01/2018',
        link: 'https://meileaf.com/tea/jasmine-jade-oolong/',
        brewing: {
            western: {
                temperature: 99,
                amount: 1,
                baseDuration: 120,
                durationIncrease: 30,
                infusions: 3,
            },
            gongfu: {
                temperature: 99,
                amount: 5,
                baseDuration: 20,
                durationIncrease: 10,
                infusions: 9,
            },
        },
    },
    {
        type: 6,
        color: '#e0c159',
        name: 'White Blossom',
        nameOther: 'White Jasmine and Chrysanthemum',
        season: 'Various',
        cultivar: 'Various',
        origin: 'Various',
        rating: 3,
        blend: [
            'Jasmine Yinzhen White',
            'Chrysanthemum Flowers',
        ],
        updated: '13/01/2018',
        link: 'https://meileaf.com/tea/white-blossom/',
        brewing: {
            western: {
                temperature: 80,
                amount: 0.5,
                baseDuration: 180,
                durationIncrease: 30,
                infusions: 3,
            },
            gongfu: {
                temperature: 80,
                amount: 3.5,
                baseDuration: 30,
                durationIncrease: 10,
                infusions: 5,
            },
        },
    },
    {
        type: 2,
        color: '#d4c059',
        name: 'White Peony',
        nameOther: 'Bai Mu Dan',
        season: 'Spring 2016',
        cultivar: 'Da Bai',
        origin: 'Taimu, Fujian, China',
        rating: 5,
        updated: '13/01/2018',
        link: 'https://meileaf.com/tea/white-peony/',
        brewing: {
            western: {
                temperature: 85,
                amount: 0.5,
                baseDuration: 120,
                durationIncrease: 30,
                infusions: 5,
            },
            gongfu: {
                temperature: 85,
                amount: 3.5,
                baseDuration: 20,
                durationIncrease: 10,
                infusions: 7,
            },
        },
    },
    {
        type: 1,
        color: '#efd864',
        name: 'Cloud and Mist',
        nameOther: 'Yun Wu',
        season: '15th April 2017',
        cultivar: 'Xiao Ye',
        origin: 'Yu Yuan, Zhejiang, China',
        rating: 3,
        updated: '13/01/2018',
        link: 'https://meileaf.com/tea/cloud-lake/',
        brewing: {
            western: {
                temperature: 80,
                amount: 0.5,
                baseDuration: 120,
                durationIncrease: 30,
                infusions: 3,
            },
            gongfu: {
                temperature: 80,
                amount: 3.5,
                baseDuration: 10,
                durationIncrease: 5,
                infusions: 7,
            },
        },
    },
    {
        type: 7,
        color: '#ece74b',
        name: 'Lotus Leaves',
        nameOther: 'He Ye',
        season: false,
        cultivar: 'Folium Nelumbinis',
        origin: false,
        rating: 5,
        updated: '13/01/2018',
        link: 'https://innatureteas.com/shop/lotus-tea/lotus-tea',
        brewing: {
            gongfu: {
                temperature: 90,
                amount: 3,
                baseDuration: 120,
                durationIncrease: 30,
                infusions: 5,
            },
        },
    },
    {
        type: 1,
        color: '#a0a056',
        name: 'Green Snail Spring',
        nameOther: 'Suzhou Bi Luo Chun',
        season: '27th March 2017',
        cultivar: 'Dong Ting Qunti',
        origin: 'Dong Ting, Jiangsu, China',
        rating: false,
        updated: '14/01/2018',
        link: 'https://meileaf.com/tea/green-coil-tea/',
        brewing: {
            western: {
                temperature: 80,
                amount: 0.5,
                baseDuration: 120,
                durationIncrease: 60,
                infusions: 2,
            },
            gongfu: {
                temperature: 80,
                amount: 3.5,
                baseDuration: 15,
                durationIncrease: 5,
                infusions: 5,
            },
        },
    },
    {
        type: 3,
        color: '#af4a02',
        name: 'Amber Gaba',
        nameOther: false,
        season: 'Spring 2016',
        cultivar: 'Chin Xin',
        origin: 'Alishan, Chiayi, Taiwan',
        rating: 3,
        updated: '14/01/2018',
        link: 'https://meileaf.com/tea/amber-gaba-oolong/',
        brewing: {
            western: {
                temperature: 99,
                amount: 1,
                baseDuration: 120,
                durationIncrease: 30,
                infusions: 3,
            },
            gongfu: {
                temperature: 99,
                amount: 5,
                baseDuration: 25,
                durationIncrease: 5,
                infusions: 9,
            },
        },
    },
    {
        type: 5,
        color: '#4f0101',
        name: 'Yong Zhen Pu-erh',
        nameOther: false,
        season: '2008',
        cultivar: false,
        origin: 'Lincang, Yunnan, China',
        rating: 2,
        updated: '15/01/2018',
        link: false,
        brewing: {
            gongfu: {
                temperature: 99,
                amount: 5,
                baseDuration: 10,
                durationIncrease: 5,
                infusions: 10,
            },
        },
    },
    {
        type: 1,
        color: '#e0e37e',
        name: 'Yellow Mountain Fur Peak',
        nameOther: 'Huang Shan Mao Feng',
        season: '23rd April 2017',
        cultivar: false,
        origin: 'Xiuning, Anhui, China',
        rating: 5,
        updated: '15/01/2018',
        link: 'https://www.teavivre.com/organic-huang-shan-mao-feng-green-tea.html',
        brewing: {
            western: {
                temperature: 85,
                amount: 1,
                baseDuration: 180,
                durationIncrease: 60,
                infusions: 2,
            },
            gongfu: {
                temperature: 85,
                amount: 3.5,
                baseDuration: 30,
                durationIncrease: 30,
                infusions: 4,
            },
        },
    },
    {
        type: 7,
        color: '#cdd22c',
        name: 'Ivan Chai',
        nameOther: 'Fireweed',
        season: false,
        cultivar: 'Chamaenerion Angustifolium',
        origin: 'Russia',
        rating: 4,
        updated: '17/01/2018',
        lnik: false,
        brewing: {
            western: {
                temperature: 90,
                amount: 3,
                baseDuration: 180,
                durationIncrease: 120,
                infusions: 3,
            },
        },
    },
    {
        type: 1,
        color: '#b4b84b',
        name: 'Uji Genmai Matcha',
        nameOther: false,
        season: false,
        cultivar: false,
        origin: 'Uji, Kyoto, Japan',
        rating: 1,
        updated: '19/01/2018',
        link: false,
        brewing: {
            western: {
                temperature: 80,
                amount: 1,
                baseDuration: 120,
                durationIncrease: 30,
                infusions: 2,
            },
            gongfu: {
                temperature: 80,
                amount: 5,
                baseDuration: 15,
                durationIncrease: 10,
                infusions: 5,
            },
        },
    },
];