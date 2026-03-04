const db = require('../database/db');

// 모든 프로젝트 목록 조회
exports.getAllProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects ORDER BY project_key ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 프로젝트 상세 조회 (Summary, Tasks 포함)
exports.getProjectDetail = async (req, res) => {
  const { key } = req.params;
  try {
    const project = await db.query('SELECT * FROM projects WHERE project_key = $1', [key]);
    const summary = await db.query('SELECT * FROM project_summaries WHERE project_key = $1', [key]);
    const tasks = await db.query('SELECT * FROM project_tasks WHERE project_key = $1', [key]);

    const links = await db.query('SELECT * FROM project_links WHERE project_key = $1', [key]);
    const images = await db.query('SELECT * FROM project_images WHERE project_key = $1', [key]);
    const configurations = await db.query('SELECT * FROM project_configurations WHERE project_key = $1', [key]);

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      ...project.rows[0],
      summary: summary.rows[0],
      tasks: tasks.rows[0],
      links: links.rows[0],
      images: images.rows[0],
      configurations: configurations.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};