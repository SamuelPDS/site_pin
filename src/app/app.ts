import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SiteFooter } from "./shared/site-footer/site-footer";
import { SiteHeader } from "./shared/site-header/site-header";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
