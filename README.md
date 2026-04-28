# 1 - Configuration Jenkins pour build/push Docker

1) Créer le jobs 
- Name: Integration-Delivery-Pipeline-Backend
- Type: Pipeline script from SCM
- Repository URL: https://github.com/danphannguyen/efrei-pipeline-backend.git
- Branch specifier: */main
- Script path: Jenkinsfile

2) Variables d'environnement requises pour le job
Ouvrez votre job → Configure.
Cochez "This project is parameterized".
Add Parameter → "String Parameter".

  - `DOCKERHUB_NAMESPACE` — votre nom d'utilisateur ou organisation Docker Hub (ex. `dvnpn`).
  - `DOCKERHUB_REPO_NAME` — nom du repository Docker Hub pour l'image backend (ex. `efrei-pipeline-api`). **Obligatoire** — le pipeline échouera si non défini.

# 2 - Configuration Jenkins pour Deploy
1) Créer le jobs 
- Name: Deploy-Pipeline-Backend
- Type: Pipeline script from SCM
- Repository URL: https://github.com/danphannguyen/efrei-pipeline-frontend.git
- Branch specifier: */main
- Script path: Jenkinsfile.deploy

2) Variables d'environnement requises pour le job
- `DEPLOY_HOST`: l'ip de votre machine de déploiement
- `DEPLOY_USER`: Utilisateur SSH pour le déploiement
**Obligatoire** — le pipeline échouera si non défini.
