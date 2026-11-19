// 作品データから作品カードを生成する
export function renderProjects(container, projects, onSelect) {
    container.replaceChildren(
        ...projects.map((project) => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const title = document.createElement('h3');
            title.textContent = project.title;

            const description = document.createElement('p');
            description.className = 'project-description';
            description.textContent = project.description;

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

            card.append(title, description, tech, period);
            card.addEventListener('click', () => onSelect(project));
            return card;
        })
    );
}
