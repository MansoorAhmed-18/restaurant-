import { _ as createFileRoute, g as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as meta } from "./meta-Bfy40CcT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-Tur3M1n3.js
var $$splitComponentImporter = () => import("./payments-Bhgl7z0f.mjs");
var Route = createFileRoute("/payments")({
	validateSearch: (s) => ({ order: typeof s.order === "string" ? s.order : void 0 }),
	head: () => meta("Payments", "Payment status for every bill plus UPI QR collection."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
