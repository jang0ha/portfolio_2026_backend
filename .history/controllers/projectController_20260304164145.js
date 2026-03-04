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
    // 1. 기본 프로젝트 정보 조회
    const project = await db.query('SELECT * FROM projects WHERE project_key = $1', [key]);

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. 관련 테이블 정보들 병렬 조회 (성능 최적화)
    const [summary, tasks, links, images, configurations] = await Promise.all([
      db.query('SELECT type, people, contribution, tech, language, period FROM project_summaries WHERE project_key = $1', [key]),
      db.query('SELECT task_text FROM project_tasks WHERE project_key = $1', [key]),
      db.query('SELECT label, url FROM project_links WHERE project_key = $1', [key]),
      db.query('SELECT device, src, alt FROM project_images WHERE project_key = $1', [key]),
      db.query('SELECT label, description FROM project_configurations WHERE project_key = $1', [key])
    ]);

    // 3. 결과 조립 (id와 project_key는 SQL 단계에서 제외하거나 여기서 필터링)
    res.status(200).json({
      ...project.rows[0],
      summary: summary.rows, // 전체 배열 반환
      tasks: tasks.rows.map(t => t.task_text), // 텍스트만 깔끔하게 배열로 만들 경우
      links: links.rows,
      images: images.rows,
      configurations: configurations.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};