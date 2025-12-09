// 🎯 CATEGORÍAS COLAPSABLES
document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.category-header');

    categories.forEach(header => {
        header.addEventListener('click', () => {
            const category = header.parentElement;
            category.classList.toggle('collapsed');

            // Guardar estado en localStorage
            const categoryName = header.querySelector('span').textContent;
            const isCollapsed = category.classList.contains('collapsed');
            localStorage.setItem(`category-${categoryName}`, isCollapsed);
        });

        // Restaurar estado guardado (o contraer por defecto)
        const categoryName = header.querySelector('span').textContent;
        const savedState = localStorage.getItem(`category-${categoryName}`);

        // Si nunca se ha guardado estado, contraer por defecto
        // Si se guardó estado, respetar ese estado
        if (savedState === null) {
            // Primera vez: contraer por defecto
            header.parentElement.classList.add('collapsed');
        } else if (savedState === 'true') {
            // Estado guardado: contraído
            header.parentElement.classList.add('collapsed');
        }
        // Si savedState === 'false', dejar expandido (no hacer nada)
    });
});
