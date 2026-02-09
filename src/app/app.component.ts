import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './shared/drawer/drawer.component';
import { CartService } from './shared/services/cart.service';
import { SwUpdate } from '@angular/service-worker';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, DrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  isCartOpen$ = this._cartService.isOpen$;
  isOffline = false;
  showInstallPrompt = false;
  showUpdateBanner = false;
  private _deferredPrompt: any;
  private _destroy$ = new Subject<void>();

  constructor(
    private _cartService: CartService,
    private _swUpdate: SwUpdate,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.listenToOnlineStatus();
    this.listenToInstallPrompt();
    this.listenToUpdates();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  installApp() {
    if (!this._deferredPrompt) return;
    this._deferredPrompt.prompt();
    this._deferredPrompt.userChoice.then(() => {
      this._deferredPrompt = null;
      this.showInstallPrompt = false;
      this._cdr.markForCheck();
    });
  }

  dismissInstall() {
    this.showInstallPrompt = false;
    this._cdr.markForCheck();
  }

  reloadApp() {
    window.location.reload();
  }

  private listenToOnlineStatus() {
    this.isOffline = !navigator.onLine;

    window.addEventListener('online', () => {
      this.isOffline = false;
      this._cdr.markForCheck();
    });

    window.addEventListener('offline', () => {
      this.isOffline = true;
      this._cdr.markForCheck();
    });
  }

  private listenToInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this._deferredPrompt = e;
      this.showInstallPrompt = true;
      this._cdr.markForCheck();
    });
  }

  private listenToUpdates() {
    if (!this._swUpdate.isEnabled) return;

    this._swUpdate.versionUpdates
      .pipe(
        filter((evt) => evt.type === 'VERSION_READY'),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.showUpdateBanner = true;
        this._cdr.markForCheck();
      });
  }
}
