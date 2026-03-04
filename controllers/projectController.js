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
    // 1. 메인 프로젝트 정보 조회
    const project = await db.query(
      'SELECT project_key, sort, title FROM projects WHERE project_key = $1', 
      [key]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. 관련 데이터들 병렬 조회 (DISTINCT로 중복 제거)
    const [summary, tasks, links, images, configs] = await Promise.all([
      db.query('SELECT DISTINCT type, people, contribution, tech, language, period FROM project_summaries WHERE project_key = $1', [key]),
      db.query('SELECT DISTINCT task_text FROM project_tasks WHERE project_key = $1', [key]),
      db.query('SELECT DISTINCT label, url FROM project_links WHERE project_key = $1', [key]),
      db.query('SELECT DISTINCT device, src, alt FROM project_images WHERE project_key = $1', [key]),
      db.query('SELECT DISTINCT label, description FROM project_configurations WHERE project_key = $1', [key])
    ]);

    // 3. 최종 데이터 조립 (모든 상세 항목을 배열로 통일)
    res.status(200).json({
      project_key: project.rows[0].project_key,
      sort: project.rows[0].sort,
      title: project.rows[0].title,

      // 모든 항목을 배열[] 형태로 반환
      summary: summary.rows || [], 
      tasks: tasks.rows.length > 0 ? tasks.rows.map(t => t.task_text) : [], 
      links: links.rows || [],
      images: images.rows || [],
      configurations: configs.rows || []
    });

  } catch (err) {
    console.error("Error fetching project detail:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};