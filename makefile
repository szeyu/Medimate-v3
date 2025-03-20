commit-frontend-dev:
	@git add .
	@git commit -m "$(message)"
	@git push origin frontend-dev
