export function initRedditEmbeds() {
  const embeds = document.querySelectorAll<HTMLElement>(".reddit-embed");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const container = entry.target as HTMLElement;
          const url = container.dataset.url;
          const height = container.dataset.height || "400";

          if (url && !container.querySelector("iframe")) {
            const iframe = document.createElement("iframe");
            iframe.src = url;
            iframe.width = "100%";
            iframe.height = height;
            iframe.style.border = "none";
            iframe.style.borderRadius = "8px";
            iframe.sandbox =
              "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox";
            iframe.loading = "lazy";
            iframe.title = "Reddit post";

            container.innerHTML = "";
            container.appendChild(iframe);
          }

          observer.unobserve(container);
        }
      });
    },
    { rootMargin: "100px" },
  );

  embeds.forEach((embed) => observer.observe(embed));
}
