from beam import Image, endpoint

image = Image().from_dockerfile("./Dockerfile")


@endpoint(image=image, name="statsBAPI", cpu=1, memory=512)
def handler():
  return {"message": "Hello, World!"}

