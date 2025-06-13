import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const secretKey = 'secret_J2ZiF-0fb-t7tNL9Na6sQvnrDjift_BT2fLTagFFlfc';
const user_data = (localStorage.getItem('user_data')) ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('user_data'), secretKey).toString(CryptoJS.enc.Utf8)) : [];

let user_role_super_admin = (user_data['role'] == 'super_admin');
let user_role_organisation_admin = (user_data['role'] == 'organisation_admin');
let user_role_organisation_comptable_senior = (user_data['role'] == 'organisation_comptable_senior');
let user_role_organisation_comptable_site = (user_data['role'] == 'organisation_comptable_site');
let user_role_organisation_comptable_collab = (user_data['role'] == 'organisation_comptable_collab');

let NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'admin_id',
    title: 'ADMIN',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'basic',
        title: 'Manage',
        type: 'collapse',
        icon: 'feather icon-box',
        hidden: false,
        // hidden: (user_role_super_admin) ? false : true,
        children: [
          {
            id: 'demandes_id',
            title: 'Demandes',
            type: 'item',
            url: '/demandes'
          },
          // {
          //   id: 'site_id',
          //   title: 'Sites',
          //   type: 'item',
          //   url: '/sites'
          // },
        ]
      },

    ]
  },

];

@Injectable()
export class NavigationItem {
  secretKey = 'secret_J2ZiF-0fb-t7tNL9Na6sQvnrDjift_BT2fLTagFFlfc';


  get() {
    return NavigationItems;
  }

  // Fonction pour déchiffrer le JWT
  decryptSTR(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
