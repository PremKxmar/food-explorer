export default function Footer() {
  return (
    <footer className="bg-surface w-full py-xl border-t border-white/5">
      <div className="flex flex-col items-center gap-md px-margin-mobile md:px-margin-desktop text-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🥗</span>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">FoodExplorer</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[500px]">
          Powered by Open Food Facts — The free food products database. Data is available under the Open Database License.
        </p>
        <div className="flex gap-lg mt-md">
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-all" href="#">License</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-all" href="#">Privacy Policy</a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-all" href="#">Terms of Service</a>
        </div>
        <div className="mt-lg pt-lg border-t border-white/5 w-full max-w-sm">
          <p className="font-body-sm text-body-sm text-on-surface-variant opacity-50">© 2024 FoodExplorer Inc.</p>
        </div>
      </div>
    </footer>
  );
}
