<template>
  <div id="creating">
    <div class="container">
        <form>
            <div class="container-1">
                <div class="name">
                    <label>Nome Da Sala:</label>
                    <input type="text" name="roomName">
                </div>
                <div class="membersNumber">
                    <label>quantidade max de membros:</label>
                    <input type="number" id="maxMembers">
                </div>
            </div>
            <div class="password">
                <div class="passbox">
                    <label for="pass">Senha?</label>
                    <input type="checkbox" name="passChoice" id="pass">
                </div>
            <input type="text" name="password">
            </div>
            <input type="submit" value="criar sala">
        </form>

    </div>
  </div>
</template>

<script>
export default {
    name: '',
}
</script>

<style scoped>

    #creating{
        flex: 1;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .container {
        width: 100%;
        max-width: 500px;
        background-color: var(--corMenu);
    }
    form {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    input {
    max-width: 300px;
    background-color: white;
    padding: 3px 5px;
    margin: 5px 2px;
    outline: none;
    border-radius: 5px;
    font-family: cursive;
    font-size: 1em;
    color: var(--cor1);
    }
    label {
        font-family: cursive;
        color: var(--cor2);
    }

</style>