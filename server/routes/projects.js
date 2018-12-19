const express = require('express')
const router = express.Router()
const requiredAuth = require('../middleware/auth')
const { projectOwner, projectEditor } = require('../middleware/roles')
const projectController = require('../controllers/project')

// ============================================================================
// GET
// ============================================================================
// router.get('/', [requiredAuth], projectController.getProjects)
router.get('/', [requiredAuth], projectController.getProjects)
router.get('/favorite', requiredAuth, projectController.getFavoriteProjects)
router.get('/roles', requiredAuth, projectController.getProjectRoles)
router.get('/:id', [requiredAuth], projectController.getProjectById)
router.get(
  '/:id/members',
  requiredAuth,
  projectController.getProjectByIdMembers
)
router.get(
  '/:username/:slug',
  requiredAuth,
  projectController.getProjectByOwnerBySlug
)
router.get(
  '/:username/:slug/tasks',
  requiredAuth,
  projectController.getProjectByOwnerBySlugTasks
)
router.get(
  '/:username/:slug/task/:taskSlug',
  requiredAuth,
  projectController.getProjectByOwnerBySlugByTask
)
router.get(
  '/:id/:slug/isOwner',
  requiredAuth,
  projectController.getIsOwnerByProject
)
router.get(
  '/:id/tasks/counts',
  requiredAuth,
  projectController.getProjectByIdCounts
)
// ============================================================================
// POST
// ============================================================================
router.post('/', requiredAuth, projectController.createProject)
router.post(
  '/:id/createTask',
  [requiredAuth, projectEditor],
  projectController.createProjectTask
)
router.post(
  '/:id/favorite',
  requiredAuth,
  projectController.toggleProjectFavorite
)

// ============================================================================
// PUT
// ============================================================================
// Обновление проекта
router.put('/:id', [requiredAuth], projectController.updateProjectById)
// Удаление участников проекта
router.put(
  '/:id/removeMembers',
  [requiredAuth, projectEditor],
  projectController.removeMembersByProject
)
router.put(
  '/:id/addMembers',
  [requiredAuth, projectEditor],
  projectController.addMembersByProject
)
router.put(
  '/:id/updateRole',
  [requiredAuth, projectEditor],
  projectController.updateMemberRoleByProject
)
// Изменение ключа
router.put(
  '/:id/changeKey',
  [requiredAuth, projectEditor],
  projectController.updateProjectAndTasksKey
)
// ============================================================================
// DELETE
// ============================================================================
// Удаление проекта
router.delete(
  '/:id',
  [requiredAuth, projectOwner],
  projectController.deleteProjectById
)

module.exports = router
