import { MenuItem } from "../models/menu-item";
import { UserRole } from "../models/profile";
import { IonIcon } from '@ionic/angular';

export const PATH = {
    logo: 'assets/svg/elephant-logo-white.svg'
  };

  
  // Extracting each object in the pagesData array into separate variables
export const homeData = {
  title: 'SIDE_MENU.HOME',
  url: 'home/map',
  icon: 'home',
  roles: [
    UserRole.DEPARTMENT_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.PUBLIC_USER,
    UserRole.DEPARTMENT_USER,
    UserRole.NO_USER,
  ],
  children: []
};

export const myTracksData = {
  title: 'SIDE_MENU.MY_TRACKS',
  url: '/track/my-tracks',
  icon: 'list',
  parent: 'track',
  roles: [
    UserRole.DEPARTMENT_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.PUBLIC_USER,
    UserRole.DEPARTMENT_USER,
  ],
  children: [
    {
      title: 'SIDE_MENU.ADD_TRACKS',
      url: '/track/track-data/new',
      icon: 'list',
      roles: [
        UserRole.DEPARTMENT_ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.PUBLIC_USER,
        UserRole.DEPARTMENT_USER,
      ]
    },
    {
      title: 'SIDE_MENU.MY_TRACKS',
      url: '/track/my-tracks',
      icon: 'list',
      roles: [
        UserRole.DEPARTMENT_ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.PUBLIC_USER,
        UserRole.DEPARTMENT_USER,
      ]
    },
    {
      title: 'SIDE_MENU.ALL_TRACKS',
      url: '/track/all-tracks',
      icon: 'list',
      roles: [
        UserRole.DEPARTMENT_ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.PUBLIC_USER,
        UserRole.DEPARTMENT_USER,
      ]
    }
  ]
};

export const addTracksData = {
  title: 'SIDE_MENU.ADD_TRACKS',
  url: '/track/track-data/new',
  icon: 'list',
  roles: [
    UserRole.DEPARTMENT_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.PUBLIC_USER,
    UserRole.DEPARTMENT_USER,
  ],
  children: []
};

export const allTracksData = {
  title: 'SIDE_MENU.ALL_TRACKS',
  url: '/track/all-tracks',
  icon: 'list',
  roles: [UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN],
  children: []
};

export const userManagementData = {
  title: 'SIDE_MENU.USER_MANAGEMENT',
  url: '/user-management',
  icon: 'people',
  roles: [UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN],
  children: []
};


// export const pagesData = [
//     homeData,
//     myTracksData,
//     addTracksData,
//     allTracksData,
//     userManagementData
// ];


export const pagesData: MenuItem[] = [
  {
    title: 'SIDE_MENU.HOME',
    url: 'home/map',
    icon: 'home',
    roles: [
      UserRole.DEPARTMENT_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.PUBLIC_USER,
      UserRole.DEPARTMENT_USER,
      UserRole.NO_USER,
    ],
    children: []
  },
  {
    title: 'SIDE_MENU.MY_TRACKS',
    url: '/track/my-tracks',
    icon: 'footsteps',
    roles: [
      UserRole.DEPARTMENT_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.PUBLIC_USER,
      UserRole.DEPARTMENT_USER,
    ],
    children: [
      {
        title: 'SIDE_MENU.ADD_TRACKS',
        url: '/track/track-data/new',
        icon: 'list',
        roles: [
          UserRole.DEPARTMENT_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.PUBLIC_USER,
          UserRole.DEPARTMENT_USER,
        ],
        children: []
      },
      {
        title: 'SIDE_MENU.ALL_TRACKS',
        url: '/track/all-tracks',
        icon: 'list',
        roles: [
          UserRole.DEPARTMENT_ADMIN,
          UserRole.SUPER_ADMIN,
        ],
        children: []
      }
    ]
  },
  {
    title: 'SIDE_MENU.ELEPHANT_MANAGEMENT',
    url: 'elephant-management',
    icon: 'paw',
    roles: [
      UserRole.DEPARTMENT_ADMIN,
      UserRole.SUPER_ADMIN
    ],
    children: []
  },
  // {
  //   title: 'SIDE_MENU.KML_MANAGEMENT',
  //   url: 'kml-management',
  //   icon: 'list',
  //   roles: [
  //     UserRole.DEPARTMENT_ADMIN,
  //     UserRole.SUPER_ADMIN
  //   ],
  //   children: []
  // },
  {
    title: 'SIDE_MENU.RADIO_COLLAR_MANAGEMENT',
    url: '/radio-collars',
    icon: 'people',
    roles: [UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN],
    children: []
  
  },
  {
    title: 'SIDE_MENU.LANDMARK_MANAGEMENT',
    url: '/landmarks-management',
    icon: 'people',
    roles: [UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN],
    children: []
  
  },
  {
    title: 'SIDE_MENU.REPORTS_MANAGEMENT',
    url: '/reports-management/reports',
    icon: 'people',
    roles: [UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN],
    children: []
  
  },
  {
    title: 'SIDE_MENU.USER_MANAGEMENT',
    url: '/user-management',
    icon: 'people',
    roles: [UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN],
    children: []
  },
  {
    title: 'SIDE_MENU.COMPLAINTS_MANAGEMENT',
    url: '/complaints-management',
    icon: 'people',
    roles: [UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN],
    children: [
      {
        title: 'SIDE_MENU.ADD_COMPLAINTS',
        url: '/complaints-management/add-complaints',
        icon: 'list',
        roles: [
          UserRole.DEPARTMENT_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.PUBLIC_USER,
          UserRole.DEPARTMENT_USER,
        ],
        children: []
      }
    ]
  },
  {
    title: 'SIDE_MENU.ADD_ROLE',
    url: '/role-management',
    icon: 'people',
    roles: [
      UserRole.DEPARTMENT_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.PUBLIC_USER,
      UserRole.DEPARTMENT_USER,
    ],
    children: [
      {
        title: 'SIDE_MENU.ADD_CIRCLE',
        url: '/role-management/list-circle',
        icon: 'ellipse',
        roles: [UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN],
        children: []
      },
      {
        title: 'SIDE_MENU.ADD_DIVISION',
        url: '/role-management/list-division',
        icon: 'ellipse',
        roles: [UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN],
        children: []
      },
      {
        title: 'SIDE_MENU.ADD_RANGE',
        url: '/role-management/list-range',
        icon: 'ellipse',
        roles: [UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN],
        children: []
      },
      {
        title: 'SIDE_MENU.ADD_SECTION',
        url: '/role-management/list-section',
        icon: 'ellipse',
        roles: [UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN],
        children: []
      },
      {
        title: 'SIDE_MENU.ADD_VILLAGE',
        url: '/role-management/list-village',
        icon: 'ellipse',
        roles: [UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN],
        children: []
      },
    ]
  },
  {
    title: 'SIDE_MENU.ADD_ANNOUNCEMENT',
    url: '/announcement-management/list-announcement',
    icon: 'megaphone',
    roles: [UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN],
    children: []
  }
];