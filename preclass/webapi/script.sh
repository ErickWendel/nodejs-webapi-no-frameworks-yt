
echo  '\n\n requesting all heroes'
curl --silent localhost:3000/heroes 

echo '\n\n requesting the first hero'
curl --silent localhost:3000/heroes/1

echo '\n\n requesting with wrong values'
curl --silent -X POST \
    --data-binary '{"invalid": "Batman"}' \
    localhost:3000/heroes

echo '\n\n creating batman'
CREATE=$(curl --silent -X POST \
    --data-binary '{"name": "Batman","age": 200,"power": "Rich"}' \
    localhost:3000/heroes)
    
echo $CREATE

ID=$(echo $CREATE | jq .id)

echo '\n\n requesting batman'
curl --silent localhost:3000/heroes/$ID

