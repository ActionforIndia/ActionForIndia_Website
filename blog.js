function initBlogPage(data) {
  const posts = data.blog_archive?.posts?.length
    ? data.blog_archive.posts
    : data.blog_posts || [];

  document.getElementById('blog-count').textContent = `${posts.length} articles from the AFI blog`;

  document.getElementById('blog-grid').innerHTML = posts
    .map(
      (p) => `
      <a href="${p.url}" class="info-card reveal" target="_blank" rel="noopener noreferrer" style="display:block">
        <div class="info-card__meta">${p.date || p.source || 'AFI Blog'}</div>
        <div class="info-card__title">${p.title}</div>
        <div class="info-card__desc">${p.excerpt || ''}</div>
      </a>`
    )
    .join('');

  observeRevealElements();
}

initPage(initBlogPage);
