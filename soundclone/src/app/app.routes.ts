import { Routes } from '@angular/router';
import { HomepageComponent } from './Views/common.component/homepage/homepage.component';
import { ErrorComponent } from './Views/common.component/error/error.component';
import { SignInComponent } from './Views/common.component/sign-in/sign-in.component';
import { SignUpComponent } from './Views/common.component/sign-up/sign-up.component';
import { CreateTrackComponent } from './Views/Track/create-track/create-track.component';
import { ContentComponent } from './Views/common.component/content/content.component';
import { ServicesComponent } from './Views/common.component/services/services.component';
import { TrackDetailComponent } from './Views/Track/track-detail/track-detail.component';
import { ProfileComponent } from './Views/User.conponent/profile/profile.component';
import { LikedComponent } from './Views/common.component/liked/liked.component';
import { PlaylistDetailComponent } from './Views/playlist.component/playlist-detail/playlist-detail.component';
import { SearchResultsComponent } from './Views/common.component/search-results/search-results.component';

export const routes: Routes = [
  {path: 'home', component: HomepageComponent
    ,children: [
      {path: 'createtrack', component: CreateTrackComponent},
      {path: 'track-details/:id', component: TrackDetailComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'services', component: ServicesComponent},
      {path: 'result', component: SearchResultsComponent},
      {path: 'liked', component: LikedComponent},
      {path: 'playlist/:id', component: PlaylistDetailComponent},
      {path: '', component: ContentComponent },
    ]
  },
  {path: 'login', component: SignInComponent},
  {path: 'register', component: SignUpComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: ErrorComponent},

];
