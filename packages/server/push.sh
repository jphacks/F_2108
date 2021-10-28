if [ -z "$REGION" ] ; then REGION=ap-northeast-1 ; fi

aws ecr get-login-password --region "${REGION}" --profile "${PROJECT}" | \
docker login --username AWS --password-stdin "${USER_ID}".dkr.ecr.ap-northeast-1.amazonaws.com

TAG_APP="${PROJECT}-app:latest"
TAG_NGINX="${PROJECT}-nginx:latest"
REPOSITORY_APP="${USER_ID}.dkr.ecr.${REGION}.amazonaws.com/${TAG_APP}"
REPOSITORY_NGINX="${USER_ID}.dkr.ecr.${REGION}.amazonaws.com/${TAG_NGINX}"

docker tag  "$TAG_APP" "$REPOSITORY_APP"
docker tag  "$TAG_NGINX" "$REPOSITORY_NGINX"

docker push "$REPOSITORY_APP"
docker push "$REPOSITORY_NGINX"
