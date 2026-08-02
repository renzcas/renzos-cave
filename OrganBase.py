class OrganBase:
    """Base interface for MasterCore organs."""

    def pre_tick(self, snapshot):
        pass

    def tick(self, snapshot):
        pass

    def post_tick(self, snapshot):
        pass

    def snapshot(self):
        return {}
