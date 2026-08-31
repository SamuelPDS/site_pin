import { ChangeDetectionStrategy, Component } from "@angular/core";
@Component({
  selector: "app-site-footer",
  templateUrl: "./site-footer.html",
  styleUrl: "./site-footer.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  readonly currentYear = new Date().getFullYear();
}
