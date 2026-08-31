import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-site-header",
  imports: [RouterLink],
  templateUrl: "./site-header.html",
  styleUrl: "./site-header.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  @ViewChild("menuToggle", { read: ElementRef })
  private menuToggle?: ElementRef<HTMLButtonElement>;

  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(restoreFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (restoreFocus)
      queueMicrotask(() => this.menuToggle?.nativeElement.focus());
  }

  @HostListener("document:keydown.escape")
  handleEscape(): void {
    this.closeMenu(true);
  }
}
