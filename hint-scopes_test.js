'use strict';

var hint = angular.hint;
describe('ngHintScopes', function() {

  var $rootScope;

  beforeEach(module('ngHintScopes'));
  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  describe('$rootScope.$watch', function() {
    it('should not fire on registration', function() {
      spyOn(hint, 'emit');
      $rootScope.$watch('hi');

      expect(hint.emit).not.toHaveBeenCalled();
    });

    it('should fire on digest', function() {
      spyOn(hint, 'emit');
      $rootScope.$watch('hi');
      $rootScope.$apply();

      expect(hint.emit).toHaveBeenCalled();
      var args = getArgsOfNthCall(0);

      expect(args[0]).toBe('scope:watch');
      expect(args[1].scope).toBe($rootScope);
    });

    it('should fire on digest', function() {
      spyOn(hint, 'emit');
      $rootScope.$watch('hi');
      $rootScope.$apply();

      var args = getArgsOfNthCall(0);
      expect(hint.emit).toHaveBeenCalled();
      expect(args[0]).toBe('scope:watch');
      expect(args[1].watch).toBe('hi');
      expect(args[1].scope).toBe($rootScope);
    });
  });

  describe('$rootScope.$new', function() {
    it('should fire a message when called', function() {
      spyOn(hint, 'emit');
      var scope = $rootScope.$new();
      var args = getArgsOfNthCall(0);

      expect(args[0]).toBe('scope:new');
      expect(args[1].parent).toBe($rootScope);
      expect(args[1].child).toBe(scope);
    });
  });

  describe('$rootScope.$destroy', function() {
    it('should fire a message when called', function() {
      var scope = $rootScope.$new();

      spyOn(hint, 'emit');
      scope.$destroy();
      var args = getArgsOfNthCall(0);

      expect(args[0]).toBe('scope:destroy');
      expect(args[1].id).toBe(scope.id);
    });
  });

  describe('$rootScope.$apply', function() {
    it('should fire a message when called', function() {
      var scope = $rootScope.$new();
      spyOn(hint, 'emit');

      scope.$apply();

      expect(hint.emit).toHaveBeenCalled();
      var args = hint.emit.calls[1].args;

      expect(args[0]).toBe('scope:apply');
      expect(args[1].scope).toBe(scope);
      expect(args[1].time).toBeDefined();
    });
  });

  describe('hint.watch', function() {
    var scope;

    beforeEach(function () {
      scope = $rootScope.$new();
      scope.a = { b: { c: 1 } };
      spyOn(hint, 'emit');
      jasmine.Clock.useMock();
    });

    it('should fire when a watched model changes', function() {
      hint.watch(scope.$id, 'a.b.c');
      scope.a.b.c = 2;
      scope.$digest();

      jasmine.Clock.tick(10);

      expect(hint.emit).toHaveBeenCalled();
      var args = getArgsOfNthCall(1);
      expect(args[0]).toBe('model:change');

      expect(args[1]).toEqual({
        id : scope.$id,
        path : 'a.b.c',
        oldValue: 1,
        value : 2
      });

    });
  });
});

function getArgsOfNthCall(n) {
  n = n || 0;
  return hint.emit.calls[n].args;
}
