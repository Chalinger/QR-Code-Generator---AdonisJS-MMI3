import Alpine from 'alpinejs'

/**
 * Message flash : apparaît après un court délai puis disparaît au bout de 5 s
 * (components/alert/root.edge).
 */
Alpine.data('alert', function () {
  return {
    isVisible: false,
    dismiss() {
      this.isVisible = false
    },
    init() {
      setTimeout(() => {
        this.isVisible = true
      }, 80)
      setTimeout(() => {
        this.dismiss()
      }, 5000)
    },
  }
})

Alpine.start()
