// 作品データから作品カードを生成する
export function renderProjects(container, projects, onSelect) {
    container.replaceChildren(
        ...projects.map((project) => {
            const card = document.createElement('div');
            card.className = 'project-card';

            // カード上部のサムネイル（画像がない作品はプレースホルダー）
            let thumb;
            if (project.image) {
                thumb = document.createElement('img');
                thumb.className = 'project-thumb';
                thumb.src = project.image;
                thumb.alt = project.title;
                thumb.loading = 'lazy';
            } else {
                thumb = document.createElement('div');
                thumb.className = 'project-thumb project-thumb-empty';
                thumb.textContent = 'No Image';
            }

            const body = document.createElement('div');
            body.className = 'project-card-body';

            const title = document.createElement('h3');
            title.textContent = project.title;

            const tech = document.createElement('div');
            tech.className = 'project-tech';
            project.tech.forEach((name) => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = name;
                tech.append(tag);
            });

            const period = document.createElement('p');
            period.className = 'project-period';
            period.textContent = project.period;

            body.append(title, tech, period);
            card.append(thumb, body);
            card.addEventListener('click', () => onSelect(project));
            return card;
        })
    );
}
