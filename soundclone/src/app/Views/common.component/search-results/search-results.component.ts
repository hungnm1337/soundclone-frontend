import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListDataService, ListPlaylistDTO, ListTrackDTO, ArtistDTO } from '../../../Services/ListData/list-data.service';
import { ListTrackComponent } from "../list-track/list-track.component";
import { ListPlaylistComponent } from "../list-playlist/list-playlist.component";
import { ListArtistComponent } from "../list-artist/list-artist.component";
import { PlaylistStateService } from '../../../Services/Playlist/playlist-state.service';
import { Subscription } from 'rxjs';
import { FooterComponent } from "../footer/footer.component";

export type FilterType = 'all' | 'tracks' | 'playlists' | 'artists';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, ListTrackComponent, ListPlaylistComponent, ListArtistComponent, FooterComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  hasResults: boolean = false;
  artistResults: ArtistDTO[] = [];
  playlistResults: ListPlaylistDTO[] = [];
  trackResults: ListTrackDTO[] = [];

  // Filter functionality
  activeFilter: FilterType = 'all';
  filterOptions: { value: FilterType; label: string; count: number }[] = [];
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listDataService: ListDataService,
    private playlistStateService: PlaylistStateService
  ) {}

  ngOnInit() {
    // Get search query from URL parameters
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';

      if (this.searchQuery) {
        this.performSearch();
      } else {
        // Redirect to home if no search query
        this.router.navigate(['/home']);
      }
    });

    // Subscribe to playlist updates
    this.subscription.add(
      this.playlistStateService.playlistUpdated$.subscribe(playlistId => {
        if (playlistId) {
          console.log('Playlist updated, refreshing search results...');
          this.refreshPlaylistSearch();
        }
      })
    );
  }

  performSearch() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.router.navigate(['/home']);
      return;
    }

    this.isLoading = true;

    // Simulate search API call
    setTimeout(() => {
      // Mock search results - replace with actual API call
      this.searchResults = this.getMockSearchResults();
      this.hasResults = this.searchResults.length > 0;
      this.updateFilterCounts();
      this.isLoading = false;
    }, 1000);
  }

  getMockSearchResults() {
    this.listDataService.GetTracksBySearch(this.searchQuery).subscribe(results => {
      this.trackResults = results;
      this.updateFilterCounts();
    });
    this.listDataService.GetPlaylistBySearch(this.searchQuery).subscribe(results => {
      this.playlistResults = results;
      this.updateFilterCounts();
    });
    this.listDataService.GetArtistsBySearch(this.searchQuery).subscribe(results => {
      this.artistResults = results;
      this.updateFilterCounts();
    });
    return [];
  }

  // Filter methods
  setFilter(filter: FilterType) {
    this.activeFilter = filter;
  }

  updateFilterCounts() {
    this.filterOptions = [
      { value: 'all', label: 'All', count: this.trackResults.length + this.playlistResults.length + this.artistResults.length },
      { value: 'tracks', label: 'Tracks', count: this.trackResults.length },
      { value: 'playlists', label: 'Playlists', count: this.playlistResults.length },
      { value: 'artists', label: 'Artists', count: this.artistResults.length }
    ];
  }

  shouldShowSection(section: FilterType): boolean {
    if (this.activeFilter === 'all') return true;
    return this.activeFilter === section;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  newSearch() {
    this.router.navigate(['/home']);
  }

  private refreshPlaylistSearch() {
    if (this.searchQuery) {
      this.listDataService.GetPlaylistBySearch(this.searchQuery).subscribe(results => {
        this.playlistResults = results;
        this.updateFilterCounts();
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
