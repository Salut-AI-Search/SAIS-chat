<script lang="ts">
    import logo from '../../../lib/images/logo_white.png'
</script>

<img src={logo} alt="Salut! AI Logo"/>

<style lang="scss">
    img {
        animation: rotate 7s linear infinite;
    }

    @keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>