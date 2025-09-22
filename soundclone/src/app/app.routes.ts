import { Routes } from '@angular/router';
import { HomepageComponent } from './Views/common.component/homepage/homepage.component';
import { ErrorComponent } from './Views/common.component/error/error.component';
import { SignInComponent } from './Views/common.component/sign-in/sign-in.component';
import { SignUpComponent } from './Views/common.component/sign-up/sign-up.component';
import { CreateTrackComponent } from './Views/Track.component/create-track/create-track.component';
import { ContentComponent } from './Views/common.component/content/content.component';
import { ServicesComponent } from './Views/common.component/services/services.component';
import { TrackDetailComponent } from './Views/Track.component/track-detail/track-detail.component';
import { ProfileComponent } from './Views/User.conponent/profile/profile.component';
import { LikedComponent } from './Views/common.component/liked/liked.component';
import { SearchResultsComponent } from './Views/common.component/search-results/search-results.component';
import { ArtistProfileComponent } from './Views/User.conponent/artist-profile/artist-profile.component';
import { PlaylistDetailComponent } from './Views/Playlist.component/playlist-detail/playlist-detail.component';
import { SystemReportComponent } from './Views/User.conponent/system-report/system-report.component';
import { DashboardComponent } from './Views/Admin.component/dashboard/dashboard.component';
import { SystemAnalysisComponent } from './Views/Admin.component/system-analysis/system-analysis.component';
import { AccountManageComponent } from './Views/Admin.component/account-manage/account-manage.component';
import { ReportManageComponent } from './Views/Admin.component/report-manage/report-manage.component';
import { NotificationManageComponent } from './Views/Admin.component/notification-manage/notification-manage.component';
export const routes: Routes = [
  {path: 'home', component: HomepageComponent
    ,children: [
      {path: 'createtrack', component: CreateTrackComponent},
      {path: 'track-details/:id', component: TrackDetailComponent},
      {path: 'artist-profile/:id', component: ArtistProfileComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'services', component: ServicesComponent},
      {path: 'result', component: SearchResultsComponent},
      {path: 'liked', component: LikedComponent},
      {path: 'system-report', component: SystemReportComponent},
      {path: 'playlist/:id', component: PlaylistDetailComponent},
      {path: '', component: ContentComponent },
    ]
  },
  {path: 'dashboard', component:DashboardComponent
    ,children: [
      {path: 'analysist', component: SystemAnalysisComponent},
      {path: 'accounts', component: AccountManageComponent},
      {path: 'reports', component: ReportManageComponent},
      {path: 'services', component: ServicesComponent},
      {path: 'notifications', component: NotificationManageComponent},
      {path: '', component: SystemAnalysisComponent },
      {path: '**', component: ErrorComponent},

    ]
  },
  {path: 'login', component: SignInComponent},
  {path: 'register', component: SignUpComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: ErrorComponent},

];
