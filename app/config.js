/*
 * Application configuration
 */
define({
    appElement: '#app-view',
    globalViews: ['views/MessageView'],
    views: {
        'index': {
            layout: '#layout-joth',
            className: 'index-view',
            router: ['', 'index'],
            slots: {
                '.left-content': {
                    layout: 'views/BookListView'
                },
                '.right-column': ['#index-overview-template']
            }
        },
        'book-summary': {
            layout: '#layout-joth',
            className: 'summary-view',
            router: 'book/:bookid',
            slots: {
                '.navigation-view': 'views/NavigationView',
                '.left-title': 'views/BookTitleView',
                '.left-content': 'views/TimeMapView',
                '.right-column': [
                    'views/PlaceFrequencyBarsView',
                    'views/SocialNetworkView'
                ]
            }
        },
        'reading-view': {
            layout: '#layout-joth',
            className: 'reading-view',
            router: [
                'book/:bookid/read', 
                'book/:bookid/read/:pageid',
                'book/:bookid/read/:pageid/:placeid'
            ],
            slots: {
                '.navigation-view': 'views/NavigationView',
                '.subnavigation-view': 'views/PageControlView',
                '.left-title': 'views/BookTitleView',
                '.left-content': 'views/PagesView',
                '.right-column': [
                    {
                        layout: '#layout-full-top',
                        slots: {
                            '.top-slot': 'views/TimeMapView',
                            '.bottom-slot': 'views/TimeMapLegendView'
                        }
                    },
                    'views/SocialNetworkView',
                    'views/CitationsView',
                    'views/AnnotatorsView'
                ]
            }
        },
        'place-view': {
            layout:  '#layout-joth',
            className: 'place-view',
            router: 'book/:bookid/place/:placeid',
            refreshOn: 'change:placeid',
            slots: {
                '.navigation-view': 'views/NavigationView',
                '.book-title-view': 'views/BookTitleView',
                '.left-panel': {
                    className: 'place-summary panel fill padded-scroll',
                    slots: {
                        'this': [
                            'views/PlaceSummaryView',
                            'views/BookReferencesView',
                            'views/RelatedPlacesView'
                        ]
                    }
                },
                '.right-panel': {
                    layout: '#layout-full-top',
                    className: 'place-view-right',
                    slots: {
                        '.top-slot': 'views/BookPlaceMapView',
                        '.bottom-slot': 'views/BookPlaceFlickrView'
                    }
                }
            }
        }
    },
    // number of related places to show
    relatedCount: 8,
    // number of book references to show
    bookRefCount: 5,
    // whether to fake PUT/DELETE
    emulateHTTP: true
});