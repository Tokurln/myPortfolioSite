const modal = () => document.getElementById('projectModal');

export function openProjectModal(project) {
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalExplanation').textContent = project.explanation;
    document.getElementById('modalRole').textContent = project.role;

    // 画像がない作品はプレースホルダーを表示
    const image = document.getElementById('modalImage');
    const placeholder = document.getElementById('modalImagePlaceholder');
    if (project.image) {
        image.src = project.image;
        image.alt = project.title;
        image.hidden = false;
        placeholder.hidden = true;
    } else {
        image.removeAttribute('src');
        image.hidden = true;
        placeholder.hidden = false;
    }

    // YouTube の URL があるときだけ動画セクションを表示
    const videoSection = document.querySelector('.modal-video-section');
    if (project.youtube) {
        document.getElementById('modalYoutube').src = project.youtube;
        videoSection.style.display = 'block';
    } else {
        videoSection.style.display = 'none';
    }

    modal().classList.add('show');
    document.body.style.overflow = 'hidden';
}

export function closeProjectModal() {
    modal().classList.remove('show');
    document.body.style.overflow = '';
    // 動画の再生を止める
    document.getElementById('modalYoutube').src = '';
}

export function initModal() {
    // 背景クリックで閉じる（中身のクリックでは閉じない）
    modal().addEventListener('click', (e) => {
        if (e.target === modal()) closeProjectModal();
    });
    document.querySelector('.modal-close').addEventListener('click', closeProjectModal);

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal().classList.contains('show')) {
            closeProjectModal();
        }
    });
}
